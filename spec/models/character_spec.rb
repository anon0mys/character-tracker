require 'rails_helper'

RSpec.describe Character, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
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

  context 'character_sheet' do
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

    it 'can save a character with a character sheet' do
      character = build(:character, character_sheet: valid_sheet)

      expect(character.save).to be true
      expect(character.character_sheet).to be_an_instance_of CharacterSheet
    end

    it 'can deserialize character sheets from the database' do
      character = create(:character, character_sheet: valid_sheet)

      character.reload

      expect(character.character_sheet).to be_an_instance_of CharacterSheet
    end
  end
end
