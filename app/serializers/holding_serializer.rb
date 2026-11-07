# A holding with the item fields the gear list and campaign inventory show.
# The list view leaves the item's description out; the detail view adds it.
class HoldingSerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :item_id, :holder_type, :holder_id, :quantity, :status, :notes

  field(:holder_name) { |holding| holding.holder&.name }

  field :item do |holding|
    item = holding.item
    {
      id: item.id, name: item.name, item_type: item.item_type, quality: item.quality,
      homebrew: item.homebrew, source: item.source, tags: item.tags,
      total_charges: item.total_charges, requires_attunement: item.requires_attunement, ac: item.ac
    }
  end

  view :detail do
    field(:description) { |holding| holding.item.description }
  end
end
