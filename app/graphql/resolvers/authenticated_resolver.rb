class Resolvers::AuthenticatedResolver < Resolvers::BaseResolver
  extension Types::AuthenticationExtension

  def current_user
    context[:current_user]
  end
end