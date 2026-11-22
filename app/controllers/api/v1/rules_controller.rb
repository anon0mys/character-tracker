module Api
  module V1
    # Every rule, in reading order. There are about a hundred, so the client
    # takes them all at once and searches locally.
    class RulesController < ApiController
      before_action :authenticate_user!

      def index
        render json: { data: Rule.order(:position).as_json(only: %i[id name slug category position body source]) }
      end
    end
  end
end
