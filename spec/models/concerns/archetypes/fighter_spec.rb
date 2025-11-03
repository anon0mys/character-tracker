require "rails_helper"
require_relative "shared_examples/archetype_examples"

RSpec.describe Archetypes::Fighter do
  it_behaves_like "an archetype", :fighter, "d10", nil

  describe "specific features" do
    let(:archetype) { described_class.new }

    it "is not a caster" do
      expect(archetype.caster?).to be false
    end

    it "has Fighting Style at level 1" do
      expect(archetype.feature_at_level?(1, "Fighting Style")).to be true
    end

    it "has Second Wind at level 1" do
      expect(archetype.feature_at_level?(1, "Second Wind")).to be true
    end

    it "has Extra Attack at level 5" do
      expect(archetype.feature_at_level?(5, "Extra Attack")).to be true
    end
  end
end
