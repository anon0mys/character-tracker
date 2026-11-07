module Api
  module V1
    # A campaign's inventory. Any member of the game can see and change it,
    # since the party passes things between each other's characters.
    class HoldingsController < ApiController
      before_action :authenticate_user!
      before_action :set_game

      def index
        holdings = @game.holdings.includes(:item, :holder).order(:id)
        holdings = holdings.where(item_id: params[:item_id]) if params[:item_id].present?
        render json: HoldingSerializer.render(holdings, root: :data)
      end

      def show
        render json: HoldingSerializer.render(find_holding, view: :detail, root: :data)
      end

      def create
        holding = @game.holdings.create!(holding_params.merge(holder: requested_holder))
        render json: HoldingSerializer.render(holding, view: :detail, root: :data), status: :created
      end

      def update
        holding = find_holding
        holding.update!(holding_params)
        holding = HoldingMove.new(holding, holder: requested_holder, quantity: params[:move_quantity]).call if moving?
        render json: HoldingSerializer.render(holding, view: :detail, root: :data)
      end

      def destroy
        find_holding.destroy!
        render json: {}, status: :accepted
      end

      private

      def set_game
        @game = current_user.games.find(params[:game_id])
      end

      def find_holding
        @game.holdings.find(params[:id])
      end

      def holding_params
        params.fetch(:holding, {}).permit(:item_id, :quantity, :status, :notes)
      end

      def moving?
        params.key?(:holder_type)
      end

      # nil holder_type means "not placed". Only known holder classes are looked up.
      def requested_holder
        type = params[:holder_type].presence
        return nil if type.nil?
        raise ActiveRecord::RecordNotFound, "Unknown holder type" unless Holding::HOLDER_TYPES.include?(type)

        type.constantize.find(params[:holder_id])
      end
    end
  end
end
