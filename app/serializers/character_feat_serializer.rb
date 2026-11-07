# A chosen feat rendered in the same shape as a feature row.
class CharacterFeatSerializer < Blueprinter::Base
  field :id, name: :character_feat_id
  field :feat_id
  field :character_id
  field(:category) { "feat" }
  field(:origin) { "feat" }
  field(:name) { |character_feat| character_feat.feat.name }
  field(:description) { |character_feat| character_feat.feat.sheet_description }
end
