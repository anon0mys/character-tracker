require 'rails_helper'

RSpec.describe Character, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
    it { should validate_presence_of :age }
    it { should validate_presence_of :race }
    it { should validate_presence_of :background }
  end

  context 'enums' do
    it do
      should define_enum_for(:alignment)
        .with_values(combine_to_hash(Character::ALIGNMENTS))
        .backed_by_column_of_type(:string)
    end
    it do
      should define_enum_for(:archetype)
        .with_values(combine_to_hash(Archetypes.names))
        .backed_by_column_of_type(:string)
    end
  end

  context 'relationships' do
    it { should belong_to :user }
    it { should belong_to :game }
    it { should have_many :spell_lists }
    it { should have_many(:items).through(:character_items) }
  end

  context 'level and proficiency' do
    let (:character) { create(:character) }

    it 'should start at level 1' do
      expect(character.level).to eq 1
    end

    it 'should base proficiency bonus on level' do
      expect(character.proficiency_bonus).to eq 2

      character.level = 4
      expect(character.proficiency_bonus).to eq 2

      character.level = 5
      expect(character.proficiency_bonus).to eq 3

      character.level = 8
      expect(character.proficiency_bonus).to eq 3

      character.level = 9
      expect(character.proficiency_bonus).to eq 4

      character.level = 12
      expect(character.proficiency_bonus).to eq 4

      character.level = 13
      expect(character.proficiency_bonus).to eq 5

      character.level = 16
      expect(character.proficiency_bonus).to eq 5

      character.level = 17
      expect(character.proficiency_bonus).to eq 6
    end
  end

  context 'abilities, modifiers, and saves' do
    let(:character) { create(:character) }

    it 'should default to ability scores of 10' do
      expect(character.strength).to eq 10
      expect(character.dexterity).to eq 10
      expect(character.constitution).to eq 10
      expect(character.intelligence).to eq 10
      expect(character.wisdom).to eq 10
      expect(character.charisma).to eq 10
    end

    it 'should find values from ability skill symbols' do
      expect(character.value_of(:strength)).to eq 10
    end

    it 'should calculate modifiers from ability skill symbols' do
      expect(character.modifier_for(:strength)).to eq 0

      character.strength = 12
      expect(character.modifier_for(:strength)).to eq 1

      character.strength = 14
      expect(character.modifier_for(:strength)).to eq 2
    end

    it 'should calculate proficiency bonus for ability skill symbols' do
      expect(character.proficiency_bonus_for(:strength)).to eq 0

      character.add_proficiency(:strength)
      expect(character.proficiency_bonus_for(:strength)).to eq 2

      character.level = 5
      expect(character.proficiency_bonus_for(:strength)).to eq 3
    end

    it 'should calculate save fo ability skill symbol' do
      expect(character.save_for(:strength)).to eq 0

      character.add_proficiency(:strength)
      expect(character.save_for(:strength)).to eq 2

      character.strength = 14
      expect(character.save_for(:strength)).to eq 4
    end
  end

  context 'calculated attributes' do
    let(:character) { create(:character) }

    it 'should calculate initiative' do
      expect(character.initiative).to eq 0

      character.initiative_bonus = 3
      expect(character.initiative).to eq 3

      character.dexterity = 14
      expect(character.initiative).to eq 5
    end

    it 'should calculate perception' do
      expect(character.perception).to eq 10

      character.wisdom = 14
      expect(character.perception).to eq 12
    end

    it 'should calculate ac' do
      expect(character.ac).to eq 10

      character.ac_bonus = 6
      expect(character.ac).to eq 16

      character.dexterity = 14
      expect(character.ac).to eq 18
    end

    it 'should calculate concentration' do
      character.proficiencies = []
      expect(character.concentration).to eq 0

      character.constitution = 12
      expect(character.concentration).to eq 1

      character.constitution = 14
      expect(character.concentration).to eq 2

      character.add_proficiency(:constitution)
      expect(character.concentration).to eq 4
    end
  end

  context 'spell casting attributes' do

    context 'for spell casting archetypes' do
      let(:character) { create(:character, archetype: :artificer) }

      it 'should calculate spell attack mod' do
        expect(character.spell_attack_mod).to eq 2

        character.intelligence = 16
        expect(character.spell_attack_mod).to eq 5

        character.level = 5
        expect(character.spell_attack_mod).to eq 6
      end

      it 'should calculate spell attack mod for classes with different casting ability' do
        character.archetype = :cleric
        expect(character.spell_attack_mod).to eq 2

        character.intelligence = 16
        expect(character.spell_attack_mod).to eq 2

        character.wisdom = 16
        expect(character.spell_attack_mod).to eq 5

        character.level = 5
        expect(character.spell_attack_mod).to eq 6
      end

      it 'should calculate spell save dc' do
        expect(character.spell_save_dc).to eq 10

        character.intelligence = 16
        expect(character.spell_save_dc).to eq 13
      end
    end

    context 'for no spell casting archetypes' do
      let(:character) { create(:character, archetype: :barbarian) }

      it 'should return nil for spell attack mod' do
        expect(character.spell_attack_mod).to eq nil
      end

      it 'should return nil for spell save dc' do
        expect(character.spell_save_dc).to eq nil
      end
    end
  end
end
