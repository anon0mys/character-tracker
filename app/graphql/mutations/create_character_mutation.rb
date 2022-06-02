class Mutations::CreateCharacterMutation < Mutations::BaseMutation
  null true
  argument :character, Types::Characters::CharacterInput

  field :character, Types::Characters::CharacterType
  field :errors, [String], null: false

  def resolve(character:)
    character = current_user.characters.build(character.to_h)
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