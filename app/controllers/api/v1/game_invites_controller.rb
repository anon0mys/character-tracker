module Api
  module V1
    # A campaign's invite links. Admins and DMs make them (role player or dm),
    # see the ones still usable, and revoke them.
    class GameInvitesController < ApiController
      include CampaignMembership

      before_action :authenticate_user!
      before_action :set_game
      before_action :require_manager!

      def index
        invites = @game.game_invites.usable.includes(:created_by).order(created_at: :desc)
        render json: GameInviteSerializer.render(invites, root: :data)
      end

      def create
        role = params.fetch(:invite, {}).fetch(:role, "player")
        invite = @game.game_invites.create!(role:, created_by: current_user)
        render json: GameInviteSerializer.render(invite, root: :data), status: :created
      end

      def destroy
        @game.game_invites.find(params[:id]).revoke!
        render json: {}, status: :accepted
      end
    end
  end
end
