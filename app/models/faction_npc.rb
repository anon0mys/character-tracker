class FactionNpc < ApplicationRecord
  belongs_to :faction
  belongs_to :npc
end
