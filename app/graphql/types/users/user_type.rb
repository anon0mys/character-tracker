module Types
  module Users
    class UserType < Types::BaseObject
      field :email, String, null: false
    end
  end
end
