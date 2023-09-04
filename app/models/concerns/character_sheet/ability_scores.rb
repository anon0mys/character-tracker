class CharacterSheet::AbilityScores
  def initialize(ability_scores, proficiency_bonus, proficiencies)
    @ability_scores = ability_scores
    @proficiencies = proficiencies
    @proficiency_bonus = proficiency_bonus
  end

  def value(ability)
    @ability_scores[ability]
  end

  def modifier(ability)
    (@ability_scores[ability] - 10) / 2
  end

  def save(ability)
    modifier(ability) + proficiency_bonus_for(ability)
  end

  def adjust_ability(ability, amount)
    @ability_scores[ability] += amount
  end

  def strength
    @ability_scores[:strength]
  end

  def dexterity
    @ability_scores[:dexterity]
  end

  def constitution
    @ability_scores[:constitution]
  end

  def intelligence
    @ability_scores[:intelligence]
  end

  def wisdom
    @ability_scores[:wisdom]
  end

  def charisma
    @ability_scores[:charisma]
  end

  def all_scores
    @ability_scores
  end

  def get_ability_data(ability)
    {
      value: value(ability),
      modifier: modifier(ability),
      save: save(ability),
    }
  end

  private

  def proficiency_bonus_for(ability)
    if @proficiencies.include?(ability)
      @proficiency_bonus
    else
      0
    end
  end
end