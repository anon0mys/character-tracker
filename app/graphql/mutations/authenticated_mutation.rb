module Mutations
  class AuthenticatedMutation < Mutations::BaseMutation
    extension Types::AuthenticationExtension

    def current_user
      context[:current_user]
    end
  end
end
