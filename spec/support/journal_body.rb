module JournalBody
  # A TipTap body: each argument is one paragraph, each paragraph a list of
  # strings (text) and hashes (mention attrs).
  def journal_body(*paragraphs)
    { "type" => "doc", "content" => paragraphs.map { |inlines| { "type" => "paragraph", "content" => inlines.map { |i| inline(i) } } } }
  end

  def person(record) = { node: "personMention", "type" => record.class.name, "id" => record.id, "label" => record.name }
  def thing(record) = { node: "thingMention", "type" => record.class.name, "id" => record.id, "label" => record.name }

  private

  def inline(item)
    return { "type" => "text", "text" => item } if item.is_a?(String)

    { "type" => item[:node], "attrs" => item.except(:node) }
  end
end

RSpec.configure { |config| config.include JournalBody }
