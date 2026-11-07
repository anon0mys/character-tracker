module Api
  module V1
    class NpcsController < ApiController
      before_action :authenticate_user!
      before_action :set_game

      def index
        npcs = @game.npcs.includes(:location, :holdings).order(:name)
        render json: NpcSerializer.render(npcs, root: :data)
      end

      def show
        render json: NpcSerializer.render(@game.npcs.find(params[:id]), root: :data)
      end

      def create
        npc = @game.npcs.create!(npc_params)
        render json: NpcSerializer.render(npc, root: :data), status: :created
      end

      def update
        npc = @game.npcs.find(params[:id])
        npc.update!(npc_params)
        render json: NpcSerializer.render(npc, root: :data)
      end

      private

      def set_game
        @game = current_user.games.find(params[:game_id])
      end

      def npc_params
        params.require(:npc).permit(:name, :description, :race, :archetype, :location_id)
      end
    end
  end
end
