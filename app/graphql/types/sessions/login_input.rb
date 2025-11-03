module Types
  module Sessions
    class LoginInput < Types::BaseInputObject
      description "Attributes for logging in"
      argument :email, String, "The email associated with your account", required: true
      argument :password, String, "The password for your account", required: true
    end
  end
end
