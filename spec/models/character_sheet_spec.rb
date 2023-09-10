require 'rails_helper'

RSpec.describe CharacterSheet do
  let (:valid_sheet) {{
    name: 'Kai',
    race: 'Domesticae (Goat)',
    archetype: :artificer,
    level: 5,
    background: 'Guild Artisan',
    alignment: 'CG',
    age: 38,
    speed: 30,
    initiative_bonus: 0,
    ac_bonus: 6,
    proficiencies: [:constitution, :intelligence],
    ability_scores: {
      strength: 12,
      dexterity: 11,
      constitution: 14,
      intelligence: 16,
      wisdom: 10,
      charisma: 10,
    }
  }}

  context 'attributes' do
    it 'initializes an empty character sheet' do
      sheet = CharacterSheet.new

      expect(sheet).to be_an_instance_of CharacterSheet
    end

    it 'contains character information' do
      sheet = CharacterSheet.new(valid_sheet)

      expect(sheet.name).to eq 'Kai'
      expect(sheet.race).to eq 'Domesticae (Goat)'
      expect(sheet.archetype).to be_an_instance_of Archetypes::Artificer
      expect(sheet.level).to eq 5
      expect(sheet.background).to eq 'Guild Artisan'
      expect(sheet.alignment).to eq 'CG'
      expect(sheet.age).to eq 38
      expect(sheet.speed).to eq 30
      expect(sheet.proficiency_bonus).to eq 3
    end

    it 'calculates proficiency bonus from level' do
      sheet = CharacterSheet.new(valid_sheet)

      expect(sheet.proficiency_bonus).to eq 3

      4.times { sheet.level_up }

      expect(sheet.proficiency_bonus).to eq 4
    end

    it 'calculates passive perception' do
      sheet = CharacterSheet.new(valid_sheet)

      expect(sheet.perception).to eq 10

      sheet.adjust_ability(:wisdom, 2)

      expect(sheet.perception).to eq 11
    end

    it 'calculates concentration' do
      sheet = CharacterSheet.new(valid_sheet)

      expect(sheet.concentration).to eq 5
    end
  end

  context 'ability scorese' do
    let (:sheet) { CharacterSheet.new(valid_sheet) }

    it 'sets up ability scores' do
      expect(sheet.ability_scores).to be_an_instance_of CharacterSheet::AbilityScores
    end

    it 'can adjust ability scores' do
      expect(sheet.ability_scores.intelligence).to eq 16

      sheet.adjust_ability(:intelligence, 2)

      expect(sheet.ability_scores.intelligence).to eq 18

      sheet.adjust_ability(:intelligence, -1)

      expect(sheet.ability_scores.intelligence).to eq 17
    end

    it 'should calculate an ability modifier' do
      expect(sheet.modifier(:wisdom)).to eq 0
      expect(sheet.modifier(:strength)).to eq 1
      expect(sheet.modifier(:constitution)).to eq 2
      expect(sheet.modifier(:intelligence)).to eq 3
    end

    it 'should calculate an ability save with proficiencies' do
      expect(sheet.save(:wisdom)).to eq 0
      expect(sheet.save(:strength)).to eq 1
      expect(sheet.save(:constitution)).to eq 5
      expect(sheet.save(:intelligence)).to eq 6
    end
  end

  context 'combat info' do
    context 'initiative' do
      it 'can calculate initiative with no mod or bonus' do
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.initiative).to eq 0
      end

      it 'can calculate initiative with mods and bonuses' do
        valid_sheet[:initiative_bonus] = 1
        valid_sheet[:ability_scores][:dexterity] = 14
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.initiative).to eq 3
      end
    end

    context 'ac' do
      it 'can calculate ac' do
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.ac).to eq 16
      end

      it 'can modify ac' do
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.ac).to eq 16

        sheet.adjust_ac(2)

        expect(sheet.ac).to eq 18

        sheet.adjust_ac(-1)

        expect(sheet.ac).to eq 17
      end
    end

    context 'spell casting' do
      it 'can calculate spell attack mod' do
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.spell_attack_mod).to eq 6
      end

      it 'can calculate spell save DC' do
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.spell_save_dc).to eq 14
      end

      it 'can calculate spell attack mod with different caster type' do
        valid_sheet[:archetype] = :cleric
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.spell_attack_mod).to eq 3
      end

      it 'can calculate spell save DC with different caster type' do
        valid_sheet[:archetype] = :cleric
        sheet = CharacterSheet.new(valid_sheet)

        expect(sheet.spell_save_dc).to eq 11
      end
    end
  end
end