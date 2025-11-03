require "rails_helper"

RSpec.describe Spell do
  context "validations" do
    context "attributes" do
      it { is_expected.to validate_presence_of :name }
      it { is_expected.to validate_presence_of :casting_time }
      it { is_expected.to validate_presence_of :range }
      it { is_expected.to validate_presence_of :duration }
    end

    context "array enums" do
      context "archetypes" do
        it { is_expected.to allow_value(Archetypes.names).for(:archetypes) }
        it { is_expected.not_to allow_value([:random]).for(:archetypes) }
      end

      context "components" do
        it { is_expected.to allow_value(Spell::COMPONENTS).for(:components) }
        it { is_expected.not_to allow_value(["RANDOM"]).for(:components) }
      end
    end

    context "enums" do
      subject(:spell) { build(:spell) }

      it do
        expect(spell).to define_enum_for(:level)
          .with_values(combine_to_hash(Spell::LEVELS))
          .backed_by_column_of_type(:string)
      end

      it do
        expect(spell).to define_enum_for(:school)
          .with_values(combine_to_hash(Spell::SCHOOLS))
          .backed_by_column_of_type(:string)
      end
    end
  end

  context "scopes" do
    it "filters by archetype" do
      create(:spell, archetypes: %i[artificer wizard])
      create(:spell, archetypes: %i[artificer druid sorcerer])
      create(:spell, archetypes: %i[cleric druid])

      expect(described_class.archetype_eq(["artificer"]).count).to eq 2
      expect(described_class.archetype_eq(["druid"]).count).to eq 2
      expect(described_class.archetype_eq(%w[cleric sorcerer]).count).to eq 2
    end

    it "filters by name" do
      create(:spell, name: "Thunderwave")
      create(:spell, name: "Greater Restoration")
      create(:spell, name: "Lesser Restoration")

      expect(described_class.name_eq("thunder").count).to eq 1
      expect(described_class.name_eq("restoration").count).to eq 2
    end

    it "filters by level" do
      create(:spell, level: "cantrip")
      create(:spell, level: "cantrip")
      create(:spell, level: "1")

      expect(described_class.level_eq(["cantrip"]).count).to eq 2
      expect(described_class.level_eq(["1"]).count).to eq 1
      expect(described_class.level_eq(["2"]).count).to eq 0
      expect(described_class.level_eq(%w[cantrip 1]).count).to eq 3
    end

    it "filters by school" do
      create(:spell, school: "conjuration")
      create(:spell, school: "conjuration")
      create(:spell, school: "evocation")

      expect(described_class.school_eq(["conjuration"]).count).to eq 2
      expect(described_class.school_eq(["evocation"]).count).to eq 1
      expect(described_class.school_eq(["abjuration"]).count).to eq 0
      expect(described_class.school_eq(%w[conjuration evocation]).count).to eq 3
    end
  end
end
