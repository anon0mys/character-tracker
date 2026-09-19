class CharacterItemSerializer < Blueprinter::Base
  identifier :id

  field :quantity
  field :item_id

  field(:name) { |character_item| character_item.item.name }
  field(:description) { |character_item| character_item.item.description }
  field(:item_type) { |character_item| character_item.item.item_type }
  field(:status) { |character_item| character_item.item.status }
  field(:quality) { |character_item| character_item.item.quality }
  field(:potential_damage) { |character_item| character_item.item.potential_damage }
  field(:total_charges) { |character_item| character_item.item.total_charges }
  field(:value) { |character_item| character_item.item.value }
  field(:ac) { |character_item| character_item.item.ac }
  field(:stat_bonuses) { |character_item| character_item.item.stat_bonuses }
  field(:requires_attunement) { |character_item| character_item.item.requires_attunement }
end
