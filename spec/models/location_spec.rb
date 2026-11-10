require "rails_helper"

RSpec.describe Location do
  subject(:location) { build(:location) }

  context "validations" do
    it { is_expected.to validate_presence_of :name }

    it "keeps a place inside its own campaign" do
      elsewhere = create(:location, game: create(:game))
      place = build(:location, game: create(:game), parent: elsewhere)

      expect(place).not_to be_valid
      expect(place.errors[:parent]).to include("must be in the same campaign")
    end

    it "refuses to nest a place inside itself or somewhere inside it" do
      game = create(:game)
      coast = create(:location, game:)
      waterdeep = create(:location, game:, parent: coast)

      coast.parent = waterdeep

      expect(coast).not_to be_valid
      coast.parent = coast
      expect(coast).not_to be_valid
    end

    it "nests any type inside any other" do
      game = create(:game)
      site = create(:location, game:, location_type: "site")

      expect(build(:location, game:, location_type: "zone", parent: site)).to be_valid
    end
  end

  context "enums" do
    it do
      expect(location).to define_enum_for(:location_type)
        .with_values(combine_to_hash(Location::LOCATION_TYPES))
        .backed_by_column_of_type(:string)
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:factions).through(:faction_locations) }
    it { is_expected.to have_many(:faction_locations).dependent(:destroy) }
    it { is_expected.to have_many :npcs }
    it { is_expected.to belong_to(:game).optional }
    it { is_expected.to belong_to(:parent).class_name("Location").optional }
    it { is_expected.to have_many(:children).class_name("Location") }
    it { is_expected.to have_many(:holdings) }
  end
end
