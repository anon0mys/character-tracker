module Api
  module V1
    class MonstersController < ApiController
      before_action :authenticate_user!

      def index
        render json: paginate(Monster.filter(filtering_params).order(:name))
      end

      private

      def filtering_params
        params.slice(:id, :name, :creature_type, :challenge_rating, :size)
      end
    end
  end
end
