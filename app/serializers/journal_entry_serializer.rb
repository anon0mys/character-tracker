# A journal entry. The list view previews its first block (TipTap JSON, so
# chips survive); the detail view adds its links and the previous entry.
class JournalEntrySerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :number, :played_on, :title, :created_at, :updated_at

  view :list do
    field(:preview) { |entry| Array(entry.body["content"]).find { |block| block["content"].present? } }
    field(:mention_count) { |entry| entry.journal_mentions.size }
  end

  view :detail do
    field(:mentions) do |entry|
      entry.journal_mentions.map do |mention|
        { type: mention.mentionable_type, id: mention.mentionable_id, label: mention.label }
      end
    end
    field(:previous) do |entry|
      previous = entry.game.journal_entries.where("number < ?", entry.number).order(number: :desc).first
      previous && { id: previous.id, number: previous.number, title: previous.title, played_on: previous.played_on }
    end
  end
end
