module Types
  class UserPayload < Types::BaseObject
    field :email, String, null: false
    field :password, String, null: false
    field :password_confirmation, String, null: false
  end
end