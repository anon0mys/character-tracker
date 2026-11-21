# Plain text of a TipTap journal body, one line per paragraph, heading or list
# item, with chips as their labels. Stored on the entry for full-text search.
module JournalText
  MENTION_NODES = JournalMention::NODE_TYPES

  def self.call(body)
    lines(body.is_a?(Hash) ? body : {}).map(&:strip).reject(&:empty?).join("\n")
  end

  # Text blocks give one line; containers (doc, lists, list items) give their
  # children's lines.
  def self.lines(node)
    children = Array(node["content"])
    return [inline_text(node)] if children.any? && children.all? { |c| inline?(c) }

    children.flat_map { |child| inline?(child) ? [inline_text(child)] : lines(child) }
  end

  def self.inline?(node)
    node["type"] == "text" || MENTION_NODES.include?(node["type"]) || node["type"] == "hardBreak"
  end

  def self.inline_text(node)
    return node["text"].to_s if node["type"] == "text"
    return node.dig("attrs", "label").to_s if MENTION_NODES.include?(node["type"])
    return " " if node["type"] == "hardBreak"

    Array(node["content"]).map { |child| inline_text(child) }.join
  end
end
