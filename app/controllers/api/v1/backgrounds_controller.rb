module Api
  module V1
    class BackgroundsController < ApiController
      before_action :authenticate_user!

      def index
        render json: paginate(Background.filter(filtering_params).order(:name))
      end

      # Unpaginated picker list, mirrors ArchetypesController#index.
      def options
        data = Background.order(:name).map do |background|
          { name: background.name, source: background.source }
        end
        render json: { data: }
      end

      private

      def filtering_params
        params.slice(:name, :source)
      end
    end
  end
end
