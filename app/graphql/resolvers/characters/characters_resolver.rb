class Resolvers::Characters::CharactersResolver < Resolvers::AuthenticatedResolver
  type [Types::Characters::CharacterType], null: false

  def resolve
    current_user.characters.all
  end
end