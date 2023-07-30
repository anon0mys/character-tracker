class Mutations::LoginMutation < Mutations::BaseMutation
  null true
  argument :credentials, Types::Sessions::LoginInput

  field :user, Types::Users::UserType
  field :token, String
  field :errors, [String], null: false

  def resolve(credentials:)
    user = User.find_by_email(credentials.email)

    if user && user.valid_password?(credentials.password)
      @current_user = user
      {
        user: user,
        token: user.generate_jwt,
        errors: []
      }
    else
      {
        user: nil,
        token: nil,
        errors: ['Email or Password is invalid']
      }
    end
  end
end