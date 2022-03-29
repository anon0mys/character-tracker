module Types
  class QueryType < Types::BaseObject
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :spells, resolver: Resolvers::Spells::SpellsResolver
    field :spell_search, resolver: Resolvers::Spells::SpellSearchResolver

    field :characters, resolver: Resolvers::Characters::CharactersResolver
  end
end
