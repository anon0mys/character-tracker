module Journal
  # The small notebook dialect journal transcripts are written in, as a TipTap
  # doc the journal editor can hold:
  #
  #   ### Heading        a heading
  #   - text             a bullet; indent two spaces per level to nest
  #   1. text            a numbered item
  #   anything else      a paragraph
  #
  # Inline text goes through the linker, so names become @/# chips.
  class Markdown
    HEADING = /\A### (.+)\z/
    LIST_ITEM = /\A( *)(-|\d+\.) (.+)\z/

    def initialize(linker)
      @linker = linker
    end

    # text: a String or an Array of lines.
    def doc(text)
      lines = text.is_a?(Array) ? text : text.to_s.lines(chomp: true)
      { "type" => "doc", "content" => blocks(lines.map(&:rstrip)) }
    end

    private

    def blocks(lines)
      out = []
      items = []
      flush = -> { out.concat(lists(items)) && items.clear }
      lines.each do |line|
        if (m = line.match(LIST_ITEM))
          items << list_item(m, items.last)
          next
        end

        flush.call
        if (m = line.match(HEADING))
          out << { "type" => "heading", "attrs" => { "level" => 3 }, "content" => [Linker.text_node(m[1])] }
        elsif line.present?
          out << paragraph(line.strip)
        end
      end
      flush.call
      out
    end

    # At most one level deeper than the item above, so every nested list has
    # an item to sit in.
    def list_item(match, above)
      depth = [match[1].size / 2, (above ? above[:depth] + 1 : 0)].min
      { depth:, ordered: match[2] != "-", text: match[3] }
    end

    # Consecutive list items into lists, consuming them from the front.
    def lists(items, depth = 0)
      out = []
      out << list(items, depth, items.first[:ordered]) while items.first && items.first[:depth] >= depth
      out
    end

    # One list at this depth: its items, plus any deeper ones nested in them,
    # until the depth drops or bullets switch to numbers (or back).
    def list(items, depth, ordered)
      list_items = []
      while (item = items.first) && item[:depth] >= depth && (item[:depth] > depth || item[:ordered] == ordered)
        if item[:depth] > depth
          list_items.last["content"].concat(lists(items, depth + 1))
        else
          list_items << { "type" => "listItem", "content" => [paragraph(items.shift[:text])] }
        end
      end
      { "type" => ordered ? "orderedList" : "bulletList", "content" => list_items }
    end

    def paragraph(text)
      { "type" => "paragraph", "content" => @linker.inline(text) }
    end
  end
end
