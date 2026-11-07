# Replaces an entry's mention rows with the mentions in its TipTap body.
# Each row keeps the text of the block it appears in as its excerpt; a target
# mentioned twice keeps its first appearance.
class JournalMentionSync
  EXCERPT_LIMIT = 300

  def self.call(entry)
    new(entry).call
  end

  def initialize(entry)
    @entry = entry
  end

  def call
    entry.journal_mentions.delete_all
    unique_mentions.each { |attrs| entry.journal_mentions.create!(attrs) }
  end

  private

  attr_reader :entry

  def unique_mentions
    blocks.flat_map { |block| mentions_in(block) }.uniq { |m| [m[:mentionable_type], m[:mentionable_id]] }
  end

  def blocks
    Array(entry.body["content"])
  end

  def mentions_in(block)
    excerpt = text_of(block).strip.truncate(EXCERPT_LIMIT)
    mention_nodes(block).filter_map { |node| row_for(node["attrs"] || {}, excerpt) }
  end

  def row_for(attrs, excerpt)
    return unless JournalMention::MENTIONABLE_TYPES.include?(attrs["type"])
    return unless attrs["id"].to_s.match?(/\A\d+\z/)

    { mentionable_type: attrs["type"], mentionable_id: attrs["id"].to_i, label: attrs["label"].to_s, excerpt: }
  end

  def mention_nodes(node)
    own = JournalMention::NODE_TYPES.include?(node["type"]) ? [node] : []
    own + Array(node["content"]).flat_map { |child| mention_nodes(child) }
  end

  def text_of(node)
    return node["text"].to_s if node["type"] == "text"
    return node.dig("attrs", "label").to_s if JournalMention::NODE_TYPES.include?(node["type"])

    Array(node["content"]).map { |child| text_of(child) }.join
  end
end
