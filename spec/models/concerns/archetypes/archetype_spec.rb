require 'rails_helper'

RSpec.describe Archetypes::Archetype do
  let(:archetype) { Archetypes::Wizard.new }

  describe '#caster?' do
    context 'for spellcasting classes' do
      it 'returns true for wizard' do
        expect(Archetypes::Wizard.new.caster?).to be true
      end

      it 'returns true for cleric' do
        expect(Archetypes::Cleric.new.caster?).to be true
      end

      it 'returns true for sorcerer' do
        expect(Archetypes::Sorcerer.new.caster?).to be true
      end
    end

    context 'for non-spellcasting classes' do
      it 'returns false for barbarian' do
        expect(Archetypes::Barbarian.new.caster?).to be false
      end

      it 'returns false for fighter' do
        expect(Archetypes::Fighter.new.caster?).to be false
      end

      it 'returns false for rogue' do
        expect(Archetypes::Rogue.new.caster?).to be false
      end
    end
  end

  describe '#class_data' do
    it 'loads class data from JSON' do
      data = archetype.class_data
      expect(data).to be_a(Hash)
      expect(data['name']).to eq('Wizard')
      expect(data['hit_dice']).to be_present
      expect(data['proficiencies']).to be_present
    end
  end

  describe '#proficiencies' do
    it 'returns proficiencies hash' do
      profs = archetype.proficiencies
      expect(profs).to be_a(Hash)
      expect(profs).to have_key('armor')
      expect(profs).to have_key('weapons')
      expect(profs).to have_key('tools')
      expect(profs).to have_key('saving_throws')
      expect(profs).to have_key('skills')
    end
  end

  describe '#armor_proficiencies' do
    it 'returns armor proficiencies' do
      armor = Archetypes::Fighter.new.armor_proficiencies
      expect(armor).to be_an(Array)
      expect(armor.length).to be > 0
    end
  end

  describe '#weapon_proficiencies' do
    it 'returns weapon proficiencies' do
      weapons = Archetypes::Fighter.new.weapon_proficiencies
      expect(weapons).to be_an(Array)
    end
  end

  describe '#saving_throw_proficiencies' do
    it 'returns saving throw proficiencies' do
      saving_throws = archetype.saving_throw_proficiencies
      expect(saving_throws).to be_an(Array)
      expect(saving_throws.length).to eq(2)
      expect(saving_throws).to include('Intelligence')
      expect(saving_throws).to include('Wisdom')
    end
  end

  describe '#skill_proficiencies' do
    it 'returns skill proficiency choices' do
      skills = archetype.skill_proficiencies
      expect(skills).to be_an(Array)
      expect(skills.first).to include('Choose two')
    end
  end

  describe '#class_features' do
    it 'returns all class features when level is nil' do
      features = archetype.class_features
      expect(features).to be_an(Array)
      expect(features.length).to be > 0
    end

    it 'returns features for a specific level' do
      features = archetype.class_features(1)
      expect(features).to be_an(Array)
      expect(features.first['level']).to eq(1)
    end
  end

  describe '#features_at_level' do
    it 'returns features for level 1' do
      features = archetype.features_at_level(1)
      expect(features).to be_an(Array)
      expect(features.first['name']).to be_present
    end

    it 'returns empty array for invalid level' do
      features = archetype.features_at_level(100)
      expect(features).to eq([])
    end
  end

  describe '#has_feature_at_level?' do
    it 'returns true for features that exist' do
      expect(archetype.has_feature_at_level?(1, 'Spellcasting')).to be true
    end

    it 'returns false for features that do not exist' do
      expect(archetype.has_feature_at_level?(1, 'Extra Attack')).to be false
    end
  end

  describe '#spellcasting_data' do
    context 'for spellcasting classes' do
      it 'returns spellcasting data for wizard' do
        data = archetype.spellcasting_data
        expect(data).to be_a(Hash)
        expect(data['ability']).to eq('Intelligence')
      end
    end

    context 'for non-spellcasting classes' do
      it 'returns empty hash for barbarian' do
        data = Archetypes::Barbarian.new.spellcasting_data
        expect(data).to eq({})
      end
    end
  end

  describe '#cantrips_known_at_level' do
    it 'returns correct cantrips for wizard at level 1' do
      expect(archetype.cantrips_known_at_level(1)).to eq(3)
    end

    it 'returns correct cantrips for wizard at level 4' do
      expect(archetype.cantrips_known_at_level(4)).to eq(4)
    end

    it 'returns correct cantrips for wizard at level 10' do
      expect(archetype.cantrips_known_at_level(10)).to eq(5)
    end

    it 'returns 0 for non-casters' do
      expect(Archetypes::Barbarian.new.cantrips_known_at_level(1)).to eq(0)
    end
  end

  describe '#spell_slots_at_level' do
    context 'for full casters' do
      it 'returns correct spell slots for wizard at level 1' do
        slots = archetype.spell_slots_at_level(1)
        expect(slots).to eq([2])
      end

      it 'returns correct spell slots for wizard at level 5' do
        slots = archetype.spell_slots_at_level(5)
        expect(slots).to eq([4, 3, 2])
      end

      it 'returns correct spell slots for wizard at level 20' do
        slots = archetype.spell_slots_at_level(20)
        expect(slots).to eq([4, 3, 3, 3, 3, 2, 2, 1, 1])
      end
    end

    context 'for half casters' do
      it 'returns correct spell slots for paladin at level 1' do
        paladin = Archetypes::Paladin.new
        slots = paladin.spell_slots_at_level(1)
        expect(slots).to eq([])
      end

      it 'returns correct spell slots for paladin at level 2' do
        paladin = Archetypes::Paladin.new
        slots = paladin.spell_slots_at_level(2)
        expect(slots).to eq([2])
      end

      it 'returns correct spell slots for paladin at level 5' do
        paladin = Archetypes::Paladin.new
        slots = paladin.spell_slots_at_level(5)
        expect(slots).to eq([4, 2])
      end
    end

    context 'for non-casters' do
      it 'returns empty array' do
        slots = Archetypes::Barbarian.new.spell_slots_at_level(5)
        expect(slots).to eq([])
      end
    end
  end

  describe '#spells_known_at_level' do
    it 'returns nil for prepared casters' do
      expect(archetype.spells_known_at_level(5)).to be_nil
    end

    it 'returns correct value for known casters' do
      sorcerer = Archetypes::Sorcerer.new
      expect(sorcerer.spells_known_at_level(1)).to be_present
    end
  end

  describe '#spells_prepared_formula' do
    it 'returns formula for prepared casters' do
      formula = archetype.spells_prepared_formula
      expect(formula).to include('Intelligence modifier')
    end

    it 'returns nil for known casters' do
      sorcerer = Archetypes::Sorcerer.new
      expect(sorcerer.spells_prepared_formula).to be_nil
    end
  end

  describe '#hit_points_at_1st_level' do
    it 'returns hit points formula for first level' do
      formula = archetype.hit_points_at_1st_level
      expect(formula).to be_present
      expect(formula).to include('Constitution')
    end
  end

  describe '#hit_points_at_higher_levels' do
    it 'returns hit points formula for higher levels' do
      formula = archetype.hit_points_at_higher_levels
      expect(formula).to be_present
      expect(formula).to include('Constitution')
    end
  end
end

