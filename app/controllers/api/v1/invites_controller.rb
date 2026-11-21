module Api
  module V1
    # An invite link from the invitee's side: what it is for, and joining.
    class InvitesController < ApiController
      before_action :authenticate_user!
      before_action :set_invite

      def show
        render json: { data: preview }
      end

      def accept
        @invite.accept!(current_user)
        render json: { data: preview }
      rescue GameInvite::Unusable => e
        render json: { errors: [e.message], error_type: "InviteUnusable" }, status: :gone
      end

      private

      def set_invite
        @invite = GameInvite.includes(:game, :created_by).find_by!(token: params[:token])
      end

      def preview
        membership = @invite.game.user_games.active.find_by(user: current_user)
        {
          game_id: @invite.game_id,
          game_name: @invite.game.name,
          role: @invite.role,
          invited_by: @invite.created_by.display_name,
          usable: @invite.usable?,
          member_role: membership&.role,
        }
      end
    end
  end
end
