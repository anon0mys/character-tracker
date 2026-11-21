module Api
  module V1
    # Who is in a campaign. Anyone in it can see the list; admins and DMs
    # change roles and remove people; anyone can leave. A campaign always keeps
    # at least one admin or DM.
    class GameMembersController < ApiController
      include CampaignMembership

      before_action :authenticate_user!
      before_action :set_game
      before_action :set_member, only: %i[update destroy]
      before_action :require_manager!, only: :update

      def index
        members = @game.user_games.active.includes(:user).order(:created_at)
        render json: GameMemberSerializer.render(members, root: :data, current_user:, characters:)
      end

      def update
        role = params.require(:member).require(:role).presence_in(UserGame::ROLES) ||
               raise(ActionController::ParameterMissing, :role)
        keep_a_manager! if role == "player"
        @member.update!(role:)
        render json: GameMemberSerializer.render(@member, root: :data, current_user:, characters:)
      end

      def destroy
        require_manager! unless @member.user_id == current_user.id
        keep_a_manager!
        @member.destroy!
        render json: {}, status: :accepted
      end

      private

      def set_member
        @member = @game.user_games.active.find(params[:id])
      end

      def keep_a_manager!
        return unless @member.last_manager?

        raise ApiController::Forbidden, "Make someone else an admin or DM first"
      end

      # Character names per user in this campaign.
      def characters
        @characters ||= @game.characters.order(:name).pluck(:user_id, :name)
                             .group_by(&:first).transform_values { |rows| rows.map(&:last) }
      end
    end
  end
end
