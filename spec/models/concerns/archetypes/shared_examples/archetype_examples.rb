RSpec.shared_examples 'an archetype' do |expected_name, expected_hit_die, expected_spellcasting_ability = nil|
  let(:archetype) { described_class.new }

  describe '#initialize' do
    it 'sets the correct name' do
      expect(archetype.name).to eq(expected_name.to_sym)
    end

    it 'sets the correct hit die' do
      expect(archetype.hit_die).to eq(expected_hit_die)
    end

    if expected_spellcasting_ability
      it 'sets the correct spellcasting ability' do
        expect(archetype.spellcasting_ability).to eq(expected_spellcasting_ability.to_sym)
      end

      it 'is a caster' do
        expect(archetype.caster?).to be true
      end
    else
      it 'has no spellcasting ability' do
        expect(archetype.spellcasting_ability).to be_nil
      end

      it 'is not a caster' do
        expect(archetype.caster?).to be false
      end
    end
  end

  describe '#class_data' do
    it 'loads class data successfully' do
      data = archetype.class_data
      expect(data).to be_a(Hash)
      expect(data['name']).to eq(expected_name.to_s.split('_').map(&:capitalize).join(' '))
    end

    it 'has hit dice information' do
      data = archetype.class_data
      expect(data['hit_dice']).to be_present
    end

    it 'has proficiencies' do
      data = archetype.class_data
      expect(data['proficiencies']).to be_present
      expect(data['proficiencies']).to be_a(Hash)
    end
  end

  describe '#saving_throw_proficiencies' do
    it 'returns exactly 2 saving throw proficiencies' do
      saving_throws = archetype.saving_throw_proficiencies
      expect(saving_throws).to be_an(Array)
      expect(saving_throws.length).to eq(2)
    end
  end

  describe '#skill_proficiencies' do
    it 'returns skill proficiency information' do
      skills = archetype.skill_proficiencies
      expect(skills).to be_an(Array)
      expect(skills.first).to be_present
    end
  end

  describe '#class_features' do
    it 'has class features at level 1' do
      features = archetype.class_features(1)
      expect(features).to be_an(Array)
      expect(features.length).to be > 0
      expect(features.first['level']).to eq(1)
    end
  end
end

