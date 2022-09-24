class Resolvers::Spells::SpellSearchResolver < Resolvers::BaseResolver
  type [Types::Spells::SpellType], null: false

  argument :search, Types::Spells::SpellSearchInput, required: true

  def resolve(search:)
    Spell.filter(search.to_h)
  end
end