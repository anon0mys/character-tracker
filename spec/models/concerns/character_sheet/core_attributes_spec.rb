require 'rails_helper'

describe CharacterSheet::CoreAttributes do
  let (:attrs) {{
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  }}

  context 'validations' do
    it 'should validate core attributes' do
      expect(CharacterSheet::CoreAttributes.new(**attrs)).to be_an_instance_of(CharacterSheet::CoreAttributes)
    end

    it 'should allow extra attrs' do
      extra = attrs.merge({extra: 1, specific: 2})
      expect(CharacterSheet::CoreAttributes.new(**extra)).to be_an_instance_of(CharacterSheet::CoreAttributes)
    end

    it 'should fail when missing core attributes' do
      invalid_attrs = attrs
      invalid_attrs.delete(:strength)
      expect {CharacterSheet::CoreAttributes.new(**invalid_attrs)}.to raise_error(Exceptions::ValidationError)
    end
  end

  context 'serialization' do
    it 'should serialize attrs to a hash' do
      skills = CharacterSheet::CoreAttributes.new(**attrs)

      expect(skills.to_h).to eq(attrs)
    end

    it 'should serialize any extra attrs to a hash' do
      extra = attrs.merge({extra: 1, specific: 2})
      skills = CharacterSheet::CoreAttributes.new(**extra)

      expect(skills.to_h).to eq(extra)
    end
  end
end