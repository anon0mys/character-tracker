require "rails_helper"

RSpec.describe Character::Tracker do
  it "is valid with a valid factory" do
    expect(build(:character_tracker)).to be_valid
  end

  it "requires a name" do
    expect(build(:character_tracker, name: nil)).not_to be_valid
  end

  it "requires reset_on to be one of the allowed values" do
    expect(build(:character_tracker, reset_on: "bogus")).not_to be_valid
    Character::Tracker::RESET_ON.each do |value|
      expect(build(:character_tracker, reset_on: value)).to be_valid
    end
  end

  it "rejects current_uses greater than max_uses" do
    tracker = build(:character_tracker, max_uses: 2, current_uses: 3)
    expect(tracker).not_to be_valid
    expect(tracker.errors[:current_uses]).to include("cannot exceed max_uses")
  end

  it "rejects negative max_uses" do
    expect(build(:character_tracker, max_uses: -1)).not_to be_valid
  end
end
