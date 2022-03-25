module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    field :user_by_id, UserType, "Get User by ID" do
      argument :id, ID
    end
    def user_by_id(args)
      User.find(args[:id])
    end

    field :user_by_name, UserType, "Get User by ID" do
      argument :name, String
    end
    def user_by_name(args)
      User.find_by(name: args[:name])
    end

    field :user_search, UserType, "Get User by ID" do
      argument :id, ID
      argument :name, String
      argument :email, String
    end
    def user_search(args)
      args = args.reject { |k, v| v.nil? }
      User.find_by(args)
    end

    field :users, [UserType], "Get User by ID"
    def users
      User.all
    end
  end
end
