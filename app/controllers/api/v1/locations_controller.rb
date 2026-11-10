module Api
  module V1
    class LocationsController < ApiController
      before_action :authenticate_user!
      before_action :set_game

      def index
        locations = @game.locations.includes(:parent, :children, :npcs, :holdings).order(:name)
        render json: LocationSerializer.render(locations, root: :data)
      end

      def show
        render json: LocationSerializer.render(find_location, root: :data)
      end

      def create
        location = @game.locations.create!(location_params)
        render json: LocationSerializer.render(location, root: :data), status: :created
      end

      def update
        location = find_location
        location.update!(location_params)
        render json: LocationSerializer.render(location, root: :data)
      end

      def destroy
        LocationRemoval.new(find_location, children_to:).call
        head :no_content
      end

      private

      def set_game
        @game = current_user.games.find(params[:game_id])
      end

      def find_location(id = params[:id])
        @game.locations.find(id)
      end

      # A place id, or "top" (or nothing) to move the places inside to the top level.
      def children_to
        return nil if params[:children_to].blank? || params[:children_to] == "top"

        find_location(params[:children_to])
      end

      def location_params
        params.require(:location).permit(:name, :description, :location_type, :parent_id)
      end
    end
  end
end
