require "rails_helper"

RSpec.describe CharacterService do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:character) { build(:character, user:, game:) }

  describe "#initialize" do
    it "initializes with character and params" do
      service = described_class.new(character, { name: "Test" })
      expect(service.character).to eq(character)
      expect(service.params[:name]).to eq("Test")
    end

    it "initializes with empty errors array" do
      service = described_class.new(character, {})
      expect(service.errors).to eq([])
    end
  end

  describe "#valid?" do
    context "with valid params" do
      it "returns true for valid wizard character" do
        params = {
          archetype: "wizard",
          level: 5,
          proficiencies: %w[arcana history],
          strength: 10,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 13,
          charisma: 11,
        }
        character.archetype = "wizard"
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end
    end

    context "with invalid params" do
      it "returns false for invalid level" do
        params = { level: 25 }
        service = described_class.new(character, params)
        expect(service.valid?).to be false
        expect(service.errors).to include("Level must be between 1 and 20")
      end

      it "returns false for invalid archetype" do
        params = { archetype: "invalid_class" }
        service = described_class.new(character, params)
        expect(service.valid?).to be false
        expect(service.errors).to include(match(/Invalid archetype/))
      end

      it "returns false for invalid ability score" do
        params = { strength: 35 }
        service = described_class.new(character, params)
        expect(service.valid?).to be false
        expect(service.errors).to include(match(/Strength must be between/))
      end

      it "returns false for invalid skill proficiency" do
        params = {
          archetype: "wizard",
          proficiencies: ["stealth"], # Not a valid wizard skill
        }
        character.archetype = "wizard"
        service = described_class.new(character, params)
        expect(service.valid?).to be false
        expect(service.errors).to include(match(/Skill proficiency.*is not valid/))
      end
    end
  end

  describe "#validate_and_update" do
    context "with valid params" do
      it "returns true and applies archetype rules" do
        params = {
          archetype: "wizard",
          level: 5,
          proficiencies: %w[arcana history],
        }
        character.archetype = "wizard"
        service = described_class.new(character, params)

        expect(service.validate_and_update).to be true
        updated_params = service.updated_params
        expect(updated_params[:proficiencies]).to include("intelligence")
        expect(updated_params[:proficiencies]).to include("wisdom")
      end

      it "automatically adds saving throw proficiencies" do
        params = {
          archetype: "cleric",
          proficiencies: ["medicine"],
        }
        character.archetype = "cleric"
        service = described_class.new(character, params)

        service.validate_and_update
        updated_params = service.updated_params
        expect(updated_params[:proficiencies]).to include("wisdom")
        expect(updated_params[:proficiencies]).to include("charisma")
      end

      it "preserves existing proficiencies when updating" do
        character.proficiencies = %w[history investigation intelligence wisdom]
        character.save!

        params = { level: 10 }
        service = described_class.new(character, params)

        service.validate_and_update
        updated_params = service.updated_params
        expect(updated_params[:proficiencies]).to include("history")
        expect(updated_params[:proficiencies]).to include("investigation")
        expect(updated_params[:proficiencies]).to include("intelligence")
        expect(updated_params[:proficiencies]).to include("wisdom")
      end
    end

    context "with invalid params" do
      it "returns false and does not apply rules" do
        params = {
          archetype: "wizard",
          level: 25, # Invalid
        }
        service = described_class.new(character, params)

        expect(service.validate_and_update).to be false
        expect(service.errors).not_to be_empty
      end
    end
  end

  describe "#updated_params" do
    it "returns params with archetype rules applied" do
      params = {
        archetype: "wizard",
        proficiencies: ["arcana"],
      }
      character.archetype = "wizard"
      service = described_class.new(character, params)

      updated = service.updated_params
      expect(updated[:proficiencies]).to include("arcana")
      expect(updated[:proficiencies]).to include("intelligence")
      expect(updated[:proficiencies]).to include("wisdom")
    end

    it "returns original params if validation fails" do
      params = { level: 25 } # Invalid
      service = described_class.new(character, params)

      updated = service.updated_params
      expect(updated[:level]).to eq(25)
      expect(service.errors).not_to be_empty
    end
  end

  describe "skill proficiency validation" do
    context "for wizard" do
      let(:character) { build(:character, archetype: "wizard", user:, game:) }

      it "allows valid wizard skills" do
        params = {
          archetype: "wizard",
          proficiencies: %w[arcana history insight investigation medicine religion],
        }
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end

      it "rejects invalid skills" do
        params = {
          archetype: "wizard",
          proficiencies: %w[stealth acrobatics],
        }
        service = described_class.new(character, params)
        expect(service.valid?).to be false
      end
    end

    context "for bard" do
      let(:character) { build(:character, archetype: "bard", user:, game:) }

      it "allows any skill for bard" do
        params = {
          archetype: "bard",
          proficiencies: %w[stealth acrobatics persuasion],
        }
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end
    end

    context "for fighter" do
      let(:character) { build(:character, archetype: "fighter", user:, game:) }

      it "allows valid fighter skills" do
        params = {
          archetype: "fighter",
          proficiencies: %w[athletics history],
        }
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end

      it "rejects invalid skills" do
        params = {
          archetype: "fighter",
          proficiencies: %w[arcana religion],
        }
        service = described_class.new(character, params)
        expect(service.valid?).to be false
      end
    end
  end

  describe "saving throw proficiency validation" do
    it "validates saving throw proficiencies match archetype" do
      params = {
        archetype: "wizard",
        proficiencies: ["constitution"], # Not a wizard saving throw
      }
      character.archetype = "wizard"
      service = described_class.new(character, params)

      expect(service.valid?).to be false
      expect(service.errors).to include(match(/Saving throw proficiency.*is not valid/))
    end

    it "allows correct saving throw proficiencies" do
      params = {
        archetype: "wizard",
        proficiencies: %w[intelligence wisdom],
      }
      character.archetype = "wizard"
      service = described_class.new(character, params)

      expect(service.valid?).to be true
    end
  end

  describe "level validation" do
    it "accepts valid levels" do
      (1..20).each do |level|
        params = { level: }
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end
    end

    it "rejects levels below 1" do
      params = { level: 0 }
      service = described_class.new(character, params)
      expect(service.valid?).to be false
    end

    it "rejects levels above 20" do
      params = { level: 21 }
      service = described_class.new(character, params)
      expect(service.valid?).to be false
    end
  end

  describe "ability score validation" do
    it "accepts valid ability scores" do
      abilities = %w[strength dexterity constitution intelligence wisdom charisma]
      abilities.each do |ability|
        params = { ability.to_sym => 15 }
        service = described_class.new(character, params)
        expect(service.valid?).to be true
      end
    end

    it "rejects ability scores below 1" do
      params = { strength: 0 }
      service = described_class.new(character, params)
      expect(service.valid?).to be false
      expect(service.errors).to include(match(/Strength must be between/))
    end

    it "rejects ability scores above 30" do
      params = { strength: 31 }
      service = described_class.new(character, params)
      expect(service.valid?).to be false
      expect(service.errors).to include(match(/Strength must be between/))
    end
  end

  describe "different archetype validations" do
    Archetypes.names.each do |archetype_name|
      context "for #{archetype_name}" do
        let(:character) { build(:character, archetype: archetype_name, user:, game:) }

        it "validates and applies rules correctly" do
          archetype_obj = Archetypes.new(archetype_name)
          saving_throws = archetype_obj.saving_throw_proficiencies.map(&:downcase)

          params = {
            archetype: archetype_name,
            level: 5,
            proficiencies: [],
          }
          service = described_class.new(character, params)

          expect(service.validate_and_update).to be true
          updated_params = service.updated_params

          # Check that saving throws were added
          saving_throws.each do |st|
            expect(updated_params[:proficiencies].map(&:downcase)).to include(st)
          end
        end
      end
    end
  end
end
