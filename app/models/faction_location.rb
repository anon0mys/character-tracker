class FactionLocation < ApplicationRecord
  belongs_to :faction
  belongs_to :location
end
