class Types::AuthenticationExtension < GraphQL::Schema::FieldExtension
  def check_authentication!(current_user)
    return if current_user

    raise GraphQL::ExecutionError, "You need to authenticate to perform this action"
  end

  def resolve(object:, arguments:, **rest)
    check_authentication!(object.context[:current_user])
    yield(object, arguments)
  end
end