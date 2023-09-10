require 'rails_helper'

describe CharacterSheet::AbilityScores do
  let (:ability_scores) {{
    strength: 12,
    dexterity: 11,
    constitution: 14,
    intelligence: 16,
    wisdom: 10,
    charisma: 10,
  }}

  let (:scores) do
    CharacterSheet::AbilityScores.new(ability_scores)
  end

  it 'should expose ability scores' do
    expect(scores.strength).to eq 12
    expect(scores.dexterity).to eq 11
    expect(scores.constitution).to eq 14
    expect(scores.intelligence).to eq 16
    expect(scores.wisdom).to eq 10
    expect(scores.charisma).to eq 10
  end

  it 'should be able to adjust an ability' do
    scores.adjust_ability(:wisdom, 2)

    expect(scores.wisdom).to eq 12

    scores.adjust_ability(:wisdom, -1)

    expect(scores.wisdom).to eq 11
  end
end