module Types
  class MutationType < Types::BaseObject
    field :create_character, mutation: Mutations::CreateCharacterMutation
    field :login, mutation: Mutations::LoginMutation
  end
end
