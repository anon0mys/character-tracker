class Api::V1::CharactersController < ApiController
  before_action :authenticate_user!

  def index
    @characters = current_user.characters.all
    render json: {data: @characters}
  end

  def show
    @character = current_user.characters.find(params[:id])
    render json: {data: @character}
  end

  def create
    @character = current_user.characters.create!(character_params)
    render json: {data: @character}
  end

  def update
    @character = current_user.characters.find(params[:id])
    if @character.update(character_params)
      render json: {data: @character}
    else
      render json: {errors: 'Invalid attributes'}, status: :unprocessable_entity
    end
  end

  def destroy
    current_user.characters.find(params[:id]).destroy
    render json: {}, status: :accepted
  end

  private

  def character_params
    params.require(:character).permit(:name, :archetype, :game_id)
  end
end