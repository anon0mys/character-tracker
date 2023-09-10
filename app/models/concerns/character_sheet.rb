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
      @archetype = Archetypes.new(@archetype)
      @level = @level.to_i
      @age = @age.to_i
      @speed = @speed.to_i
      @initiative_bonus = @initiative_bonus.to_i
      @ac_bonus = @ac_bonus.to_i
      @proficiencies = @proficiencies.map(&:to_sym)
      @ability_scores = AbilityScores.new(@ability_scores)
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
    @initiative_bonus + modifier(:dexterity)
  end

  def perception
    10 + modifier(:wisdom)
  end

  def ac
    10 + @ac_bonus + modifier(:dexterity)
  end

  def concentration
    save(:constitution)
  end

  def proficiency_bonus
    case @level
    when nil
      0
    when 0...4
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
    proficiency_bonus + modifier(@archetype.spellcasting_ability)
  end

  def spell_save_dc
    8 + spell_attack_mod
  end

  def ability_data(ability)
    {
      value: value(ability),
      modifier: modifier(ability),
      save: save(ability),
    }
  end

  def cast(sheet)
    return sheet if sheet.is_a?(CharacterSheet)
    CharacterSheet.new(sheet)
  end

  def serialize(sheet)
    if sheet
      sheet.to_json
    end
  end

  def deserialize(db_value)
    if db_value
      sheet = JSON.parse(db_value, symbolize_names: true)
      CharacterSheet.new(sheet)
    end
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
      ability_scores: @ability_scores.attributes
    }.to_json
  end

  def value(ability)
    @ability_scores.send(ability)
  end

  def modifier(ability)
    (value(ability) - 10) / 2
  end

  def save(ability)
    modifier(ability) + proficiency_bonus_for(ability)
  end

  def proficiency_bonus_for(ability)
    if @proficiencies.include?(ability)
      proficiency_bonus
    else
      0
    end
  end
end