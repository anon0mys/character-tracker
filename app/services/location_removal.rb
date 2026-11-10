# Deletes a place without losing what was in it. The places inside move whole to
# the chosen place (nil for the top level); items stored directly here become
# "not placed", keeping whatever is inside them; NPCs here have no location.
class LocationRemoval
  def initialize(location, children_to:)
    @location = location
    @children_to = children_to
  end

  def call
    validate_destination!
    Location.transaction do
      location.children.each { |child| child.update!(parent: children_to) }
      location.holdings.update_all(holder_type: nil, holder_id: nil, updated_at: Time.current) # rubocop:disable Rails/SkipsModelValidations
      location.npcs.update_all(location_id: nil, updated_at: Time.current) # rubocop:disable Rails/SkipsModelValidations
      location.reload.destroy!
    end
  end

  private

  attr_reader :location, :children_to

  def validate_destination!
    ancestor = children_to
    while ancestor
      if ancestor.id == location.id
        location.errors.add(:base, "Places inside can't move into the place being deleted")
        raise ActiveRecord::RecordInvalid, location
      end

      ancestor = ancestor.parent
    end
  end
end
