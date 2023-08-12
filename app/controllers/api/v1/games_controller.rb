class Api::V1::GamesController < ApiController
  before_action :authenticate_user!

  def index
    @games = current_user.games.all
    render json: {data: @games}
  end

  def show
    @game = current_user.games.find(params[:id])
    render json: {data: @game}
  end

  def create
    @game = Game.create!(game_params)
    current_user.user_games.create!(game: @game, status: :active, role: :admin)
    render json: {data: @game}, status: :created
  end

  def update

  end

  def destroy
    @game = Game.find(params[:id])
    raise ActiveRecord::RecordInvalid if not eligible_for_destroy
    @game.status = :deleted
    @game.save!
    render json: {}, status: :accepted
  end

  private

  def game_params
    params.require(:game).permit(:name, :description, :start_date)
  end

  def eligible_for_destroy
    # Refactor into game state machine
    user_has_permissions = current_user.is_game_admin?(params[:id])
    active_user_games = @game.user_games.where(status: :active)
    no_other_active_users = active_user_games.count == 1 && active_user_games.first.user_id == current_user.id
    user_has_permissions && no_other_active_users
  end
end