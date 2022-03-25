module Types
  class UserType < Types::BaseObject
    field :email, String, null: false
    field :characters, [Types::CharacterType]
    field :created_at, String, null: false
    field :updated_at, String, null: false
  end
end