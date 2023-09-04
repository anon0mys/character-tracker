class CharacterSheet < ActiveRecord::Type::Value
  include ActiveModel::Model

  attr_accessor :name,
                :race,
                :archetype,
                :level,
                :background,
                :alignment,
                :age,
                :speed,
                :initiative_bonus,
                :ac_bonus,
                :proficiencies,
                :ability_scores

  def initialize(attributes={})
    super
    if !attributes.empty?
      @archetype = Archetypes.build(@archetype)
      @proficiencies = @proficiencies.map(&:to_sym)
      @ability_scores = AbilityScores.new(
        @ability_scores,
        proficiency_bonus,
        @proficiencies,
      )
    end
  end

  def cast(sheet)
    return sheet if sheet.is_a?(CharacterSheet)
    CharacterSheet.new(sheet)
  end

  def serialize(sheet)
    sheet.to_json
  end

  def deserialize(db_value)
    if db_value
      sheet = JSON.parse(db_value, symbolize_names: true)
      CharacterSheet.new(sheet)
    end
  end

  def level_up
    @level += 1
  end

  def adjust_ability(ability, amount)
    @ability_scores.adjust_ability(ability, amount)
  end

  def adjust_ac(amount)
    @ac_bonus += amount
  end

  def initiative
    @initiative_bonus + @ability_scores.modifier(:dexterity)
  end

  def perception
    10 + @ability_scores.modifier(:wisdom)
  end

  def ac
    10 + @ac_bonus + @ability_scores.modifier(:dexterity)
  end

  def concentration
    @ability_scores.save(:constitution)
  end

  def proficiency_bonus
    case @level
    when 1...4
      2
    when 5...8
      3
    when 9...12
      4
    when 13...16
      5
    else
      6
    end
  end

  def spell_attack_mod
    proficiency_bonus + @ability_scores.modifier(@archetype.spellcasting_ability)
  end

  def spell_save_dc
    8 + spell_attack_mod
  end

  def to_json
    {
      name: @name,
      race: @race,
      archetype: @archetype.name,
      level: @level,
      background: @background,
      alignment: @alignment,
      age: @age,
      speed: @speed,
      initiative_bonus: @initiative_bonus,
      ac_bonus: @ac_bonus,
      proficiencies: @proficiencies,
      ability_scores: @ability_scores.all_scores
    }.to_json
  end
end