module Api
  module V1
    class LocationsController < ApiController
      before_action :authenticate_user!
      before_action :set_game

      def index
        render json: LocationSerializer.render(@game.locations.order(:name), root: :data)
      end

      def create
        location = @game.locations.create!(location_params)
        render json: LocationSerializer.render(location, root: :data), status: :created
      end

      private

      def set_game
        @game = current_user.games.find(params[:game_id])
      end

      def location_params
        params.require(:location).permit(:name, :description, :location_type)
      end
    end
  end
end
