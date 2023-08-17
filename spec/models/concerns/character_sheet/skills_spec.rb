require 'rails_helper'

describe CharacterSheet::Skills do
  let (:attrs) {{
    acrobatics: 1,
    animal_handling: 1,
    arcana: 1,
    athletics: 1,
    deception: 1,
    history: 1,
    insight: 1,
    intimidation: 1,
    investigation: 1,
    medicine: 1,
    nature: 1,
    perception: 1,
    performance: 1,
    persuasion: 1,
    religion: 1,
    sleight_of_hand: 1,
    stealth: 1,
    survival: 1,
  }}

  context 'validations' do
    it 'should validate core skills' do
      expect(CharacterSheet::Skills.new(**attrs)).to be_an_instance_of(CharacterSheet::Skills)
    end

    it 'should allow extra attrs' do
      extra = attrs.merge({extra: 1, specific: 2})
      expect(CharacterSheet::Skills.new(**extra)).to be_an_instance_of(CharacterSheet::Skills)
    end

    it 'should fail when missing core skills' do
      attrs.delete(:acrobatics)
      expect {CharacterSheet::Skills.new(**attrs)}.to raise_error(Exceptions::ValidationError)
    end
  end

  context 'serialization' do
    it 'should serialize attrs to a hash' do
      skills = CharacterSheet::Skills.new(**attrs)

      expect(skills.to_h).to eq(attrs)
    end

    it 'should serialize any extra attrs to a hash' do
      extra = attrs.merge({extra: 1, specific: 2})
      skills = CharacterSheet::Skills.new(**extra)

      expect(skills.to_h).to eq(extra)
    end
  end
end