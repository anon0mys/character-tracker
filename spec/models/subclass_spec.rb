require "rails_helper"

RSpec.describe Subclass do
  let(:wizard) { Archetype.find_by(name: "wizard") }

  it { is_expected.to belong_to(:archetype) }

  it "requires a name unique within its archetype" do
    name = wizard.subclasses.first.name
    dup = described_class.new(archetype: wizard, name:)
    expect(dup).not_to be_valid
    expect(dup.errors[:name]).to be_present
  end

  it "allows the same subclass name under a different archetype" do
    name = wizard.subclasses.first.name
    other = Archetype.find_by(name: "cleric")
    expect(described_class.new(archetype: other, name:)).to be_valid
  end
end
