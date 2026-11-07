module Api
  module V1
    class RacesController < ApiController
      before_action :authenticate_user!

      def index
        render json: paginate(Race.filter(filtering_params).order(:name))
      end

      # Unpaginated picker list, mirrors ArchetypesController#index.
      def options
        data = Race.order(:name).map do |race|
          { name: race.name, speed: race.speed, size: race.size, subraces: race.all_subraces.pluck("name") }
        end
        render json: { data: }
      end

      private

      def filtering_params
        params.slice(:name, :category, :size, :source)
      end
    end
  end
end
