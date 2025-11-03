module Api
  module V1
    class SpellsController < ApiController
      before_action :authenticate_user!

      def index
        response = paginate(Spell.filter(filtering_params))
        render json: response
      end

      private

      def filtering_params
        filters = params.slice(:archetype, :level, :school, :name)
        filters[:archetype] = filters[:archetype].split(",") if filters[:archetype]
        filters[:level] = filters[:level].split(",") if filters[:level]
        filters[:school] = filters[:school].split(",") if filters[:school]
        filters
      end
    end
  end
end
