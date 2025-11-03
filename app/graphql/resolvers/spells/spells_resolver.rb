module Resolvers
  module Spells
    class SpellsResolver < Resolvers::BaseResolver
      type [Types::Spells::SpellType], null: false

      def resolve
        Spell.all
      end
    end
  end
end
