# For controllers nested under /games/:game_id: the campaign, the signed-in
# user's membership in it, and a guard for what only admins and DMs may do.
module CampaignMembership
  extend ActiveSupport::Concern

  private

  def set_game
    @game = current_user.games.find(params[:game_id])
  end

  def membership
    @membership ||= @game.user_games.find_by!(user: current_user)
  end

  def require_manager!
    return if membership.manager?

    raise ApiController::Forbidden, "Only the campaign's admins and DM can do that"
  end
end
