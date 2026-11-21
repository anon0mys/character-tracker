require "rails_helper"

RSpec.describe JournalPageTranscriber do
  let(:page_class) { Struct.new(:content_type, :data) }
  let(:block_class) { Struct.new(:type, :text) }
  let(:reply_class) { Struct.new(:stop_reason, :content) }

  # Stands in for Anthropic::Client: records the request, returns a canned reply.
  let(:fake_client) do
    Class.new do
      attr_reader :params, :reply

      def initialize(reply) = (@reply = reply)
      def beta = self
      def messages = self

      def stream(params)
        @params = params
        Struct.new(:accumulated_message).new(@reply)
      end
    end
  end

  let(:entries) do
    [{ "played_on" => "2022-08-06", "date_estimated" => false, "title" => "In Chaos",
       "body" => "- Ba'al plucks out an eyeball", "unreadable" => [], "pages" => [1] }]
  end

  around do |example|
    key = ENV.fetch("ANTHROPIC_API_KEY", nil)
    ENV["ANTHROPIC_API_KEY"] = "test-key"
    example.run
  ensure
    ENV["ANTHROPIC_API_KEY"] = key
  end

  def transcribe(reply, **)
    client = fake_client.new(reply)
    result = described_class.call(pages: [page_class.new("image/jpeg", "page-one"), page_class.new("image/png", "page-two")],
      client:, **)
    [result, client.params]
  end

  it "sends the pages in order with the campaign's names, and returns the drafts" do
    result, params = transcribe(reply_class.new(:end_turn, [block_class.new(:text, { entries: }.to_json)]),
      known_names: ["Ba'al", "Bothane"], latest_played_on: Date.new(2022, 7, 23))

    expect(result).to eq(entries)
    expect(params).to include(model: "claude-opus-5-5", fallbacks: :default)
    expect(params[:output_config][:format_]).to include(type: :json_schema, schema: described_class::SCHEMA)
    content = params[:messages].first[:content]
    images = content.select { |block| block[:type] == "image" }
    expect(images.map { |b| b[:source][:media_type] }).to eq(["image/jpeg", "image/png"])
    expect(Base64.strict_decode64(images.first[:source][:data])).to eq("page-one")
    expect(content.last[:text]).to include("2022-07-23", "Ba'al, Bothane")
  end

  it "explains refusals, truncation and malformed replies" do
    expect { transcribe(reply_class.new(:refusal, [])) }.to raise_error(described_class::Error, /declined/)
    expect { transcribe(reply_class.new(:max_tokens, [])) }.to raise_error(described_class::Error, /fewer pages/)
    expect { transcribe(reply_class.new(:end_turn, [block_class.new(:text, "not json")])) }
      .to raise_error(described_class::Error, /malformed/)
  end

  it "says so when no API key is configured" do
    ENV["ANTHROPIC_API_KEY"] = nil
    expect { described_class.call(pages: []) }.to raise_error(described_class::Error, /ANTHROPIC_API_KEY/)
  end
end
