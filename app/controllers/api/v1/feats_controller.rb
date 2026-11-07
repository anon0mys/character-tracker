module Api
  module V1
    class FeatsController < ApiController
      before_action :authenticate_user!

      def index
        render json: paginate(Feat.filter(filtering_params).order(:name))
      end

      private

      def filtering_params
        params.slice(:name, :source)
      end
    end
  end
end
