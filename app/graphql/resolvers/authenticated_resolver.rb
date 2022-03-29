class Resolvers::AuthenticatedResolver < Resolvers::BaseResolver
  extension Resolvers::AuthenticationExtension

  def current_user
    context[:current_user]
  end
end