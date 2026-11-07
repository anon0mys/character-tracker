# Moves some or all of a holding to a new holder (or to "not placed" when the
# holder is nil). A partial move splits the pile. Landing on a matching pile —
# same item, holder and status, no notes on either — merges into it.
class HoldingMove
  def initialize(holding, holder:, quantity: nil)
    @holding = holding
    @holder = holder
    @quantity = quantity.nil? ? holding.quantity : quantity.to_i
  end

  # Returns the holding at the destination.
  def call
    validate_quantity!
    Holding.transaction { whole_pile? ? move_pile : split_pile }
  end

  private

  attr_reader :holding, :holder, :quantity

  def validate_quantity!
    return if quantity.between?(whole_pile? ? 0 : 1, holding.quantity)

    holding.errors.add(:quantity, "to move must be between 1 and #{holding.quantity}")
    raise ActiveRecord::RecordInvalid, holding
  end

  def whole_pile?
    quantity == holding.quantity
  end

  def move_pile
    target = mergeable_pile
    return holding.tap { |h| h.update!(holder:, status: arrival_status) } if target.nil? || holding.contents.exists?

    target.update!(quantity: target.quantity + quantity)
    holding.destroy!
    target
  end

  def split_pile
    holding.update!(quantity: holding.quantity - quantity)
    target = mergeable_pile
    return target.tap { |t| t.update!(quantity: t.quantity + quantity) } if target

    Holding.create!(game: holding.game, item: holding.item, holder:, quantity:, status: arrival_status)
  end

  def mergeable_pile
    return nil if holding.notes.present?

    Holding.where(game_id: holding.game_id, item_id: holding.item_id, holder:, status: arrival_status, notes: [nil, ""])
           .where.not(id: holding.id).first
  end

  # Going into a place or a container stores it; coming back out to a person
  # carries it. Gone holdings keep their status wherever they are filed.
  def arrival_status
    return holding.status if holding.gone?
    return "stored" if holder.is_a?(Location) || holder.is_a?(Holding)
    return "carried" if holding.status_stored?

    holding.status
  end
end
