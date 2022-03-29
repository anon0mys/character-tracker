class Resolvers::Spells::SpellsResolver < Resolvers::BaseResolver
  type [Types::Spells::SpellType], null: false

  def resolve
    Spell.all
  end
end