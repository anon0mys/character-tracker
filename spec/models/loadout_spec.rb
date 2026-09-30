require "rails_helper"

describe Loadout do
  let(:character) { create(:character, user: create(:user)) }

  it "leaves derived stats unchanged with no active loadout" do
    base_ac = character.ac
    base_speed = character.speed
    character.loadouts.create!(name: "Bench", active: false, modifiers: { "ac_bonus" => 2, "speed_bonus" => 10 })
    character.reload
    expect(character.ac).to eq base_ac
    expect(character.speed).to eq base_speed
  end

  it "adds the active loadout's bonuses to ac and speed" do
    base_ac = character.ac
    base_speed = character.speed
    character.loadouts.create!(name: "Guardian", active: true, modifiers: { "ac_bonus" => 1, "speed_bonus" => 5 })
    character.reload
    expect(character.ac).to eq base_ac + 1
    expect(character.speed).to eq base_speed + 5
  end

  it "allows only one active loadout per character" do
    character.loadouts.create!(name: "Guardian", active: true)
    second = character.loadouts.build(name: "Infiltrator", active: true)
    expect(second).not_to be_valid
    expect(second.errors[:active]).to be_present
  end
end
