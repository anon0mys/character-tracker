class Mutations::CreateCharacterMutation < Mutations::AuthenticatedMutation
  null true
  argument :character, Types::Characters::CharacterInput

  field :character, Types::Characters::CharacterType
  field :errors, [String], null: false

  def resolve(character:)
    character = current_user.characters.build(character.to_h)
    Pundit.authorize current_user, character, :join_game?
    if character.save
      {
        character: character,
        errors: [],
      }
    else
      {
        character: nil,
        errors: character.errors.full_messages
      }
    end
  end
end