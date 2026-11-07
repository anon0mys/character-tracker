# A link from a journal entry to a person or thing, synced from the entry's
# body. `label` is frozen at the name it was written with.
class JournalMention < ApplicationRecord
  # Add a type here (and to the typeahead) to make it mentionable.
  MENTIONABLE_TYPES = %w[Character Npc Item Monster Spell].freeze
  NODE_TYPES = %w[personMention thingMention].freeze

  belongs_to :journal_entry
  belongs_to :mentionable, polymorphic: true

  validates :mentionable_type, inclusion: { in: MENTIONABLE_TYPES }
  validates :label, presence: true
end
