# Reads photographed notebook pages into draft journal entries with Claude.
# The pages go in order with the campaign's names (so handwriting spelled the
# way the campaign spells things becomes @/# links), and the reply is JSON
# matching SCHEMA: one draft per session (see JournalPageImport for its shape).
#
#   JournalPageTranscriber.call(pages:, known_names: [...], latest_played_on: Date)
#   # => [{ "played_on" => "2022-08-06", "title" => "In Chaos", ... }]
#
# Needs ANTHROPIC_API_KEY.
class JournalPageTranscriber
  MODEL = "claude-opus-5-5".freeze
  MAX_TOKENS = 64_000
  # Server-side fallback: if the model declines a page for policy reasons, the
  # API retries on its default fallback model instead of failing the import.
  BETAS = ["server-side-fallback-2026-07-01"].freeze

  class Error < StandardError; end

  SYSTEM = <<~PROMPT.freeze
    You transcribe photographed pages of a handwritten D&D campaign journal into
    draft journal entries for a campaign tracker. The person will review your
    drafts before they are saved, so be faithful rather than polished.

    Entries: one per play session. A session starts at a dated heading
    (usually a date like 9/10/22 or 11/5 and a title). A page without its own
    date continues the session before it. Pages headed "Missed session" are
    their own entry. Pages arrive in the order given, which may not be
    chronological; put each page where its content belongs.

    Dates: write played_on as YYYY-MM-DD. When the year is missing, infer it
    from neighbouring dated pages or the campaign context. When a session has
    no date at all, estimate one between its neighbours and set
    date_estimated to true; use null only when there is nothing to go on.

    Body format (exactly this, nothing else):
      ### Heading              a heading written in the notebook
      - text                   a bullet; indent two spaces per level to nest
      1. text                  a numbered item
      plain line               a paragraph
    Keep the writer's own words and shorthand (w/, b/c, +). Fix only obvious
    slips of the pen. Write a word you cannot read as [?] and add your best
    guess or the surrounding phrase to unreadable. For a sketch or map, write
    one paragraph starting "Map sketched in the notebook:" that names what is
    drawn and labelled.

    Names: when handwriting matches one of the campaign's known names, spell it
    exactly as listed. Do not invent names that are not on the page.

    pages lists the 1-based page numbers each entry came from.
  PROMPT

  ENTRY_SCHEMA = {
    type: "object",
    additionalProperties: false,
    required: %w[played_on date_estimated title body unreadable pages],
    properties: {
      played_on: { type: %w[string null], description: "YYYY-MM-DD, or null if there is nothing to go on" },
      date_estimated: { type: "boolean" },
      title: { type: "string" },
      body: { type: "string", description: "The session's notes in the body format" },
      unreadable: { type: "array", items: { type: "string" } },
      pages: { type: "array", items: { type: "integer" } },
    },
  }.freeze

  SCHEMA = {
    type: "object",
    additionalProperties: false,
    required: ["entries"],
    properties: { entries: { type: "array", items: ENTRY_SCHEMA } },
  }.freeze

  def self.call(...)
    new(...).call
  end

  # pages: JournalPageImportPage records (or anything with content_type and
  # data), in the order they were photographed.
  def initialize(pages:, known_names: [], latest_played_on: nil, client: nil)
    @pages = pages
    @known_names = known_names
    @latest_played_on = latest_played_on
    @client = client
  end

  def call
    message = client.beta.messages.stream(
      model: MODEL,
      max_tokens: MAX_TOKENS,
      betas: BETAS,
      fallbacks: :default,
      output_config: { effort: :high, format_: { type: :json_schema, schema: SCHEMA } },
      system_: SYSTEM,
      messages: [{ role: "user", content: }],
    ).accumulated_message
    entries_from(message)
  rescue Anthropic::Errors::APIError => e
    raise Error, "Claude couldn't read the pages (#{e.class.name.demodulize}). Try again in a minute."
  end

  private

  def client
    @client ||= begin
      if ENV["ANTHROPIC_API_KEY"].blank? && ENV["ANTHROPIC_AUTH_TOKEN"].blank?
        raise Error, "Page transcription isn't set up yet: ANTHROPIC_API_KEY is missing."
      end

      Anthropic::Client.new
    end
  end

  def content
    blocks = @pages.each_with_index.flat_map do |page, index|
      [
        { type: "text", text: "Page #{index + 1}" },
        { type: "image",
          source: { type: "base64", media_type: page.content_type, data: Base64.strict_encode64(page.data) } },
      ]
    end
    blocks << { type: "text", text: context }
  end

  def context
    lines = ["Transcribe these #{@pages.size} pages into journal entries."]
    lines << "The campaign's most recent journal entry is dated #{@latest_played_on.iso8601}." if @latest_played_on
    lines << "Known names in this campaign: #{@known_names.join(', ')}." if @known_names.any?
    lines.join("\n")
  end

  def entries_from(message)
    case message.stop_reason
    when :refusal then raise Error, "Claude declined to read these pages."
    when :max_tokens then raise Error, "Too many pages to read at once. Try fewer pages per import."
    end

    text = message.content.filter_map { |block| block.text if block.type == :text }.join
    Array(JSON.parse(text)["entries"])
  rescue JSON::ParserError
    raise Error, "Claude's transcription came back malformed. Try again."
  end
end
