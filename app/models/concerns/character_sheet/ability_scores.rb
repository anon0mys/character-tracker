class CharacterSheet::AbilityScores < ActiveRecord::Type::Value
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :strength, :integer, default: 10
  attribute :dexterity, :integer, default: 10
  attribute :constitution, :integer, default: 10
  attribute :intelligence, :integer, default: 10
  attribute :wisdom, :integer, default: 10
  attribute :charisma, :integer, default: 10

  def adjust_ability(ability, amount)
    send("#{ability}=", send(ability) + amount)
  end

  def type
    :jsonb
  end
end