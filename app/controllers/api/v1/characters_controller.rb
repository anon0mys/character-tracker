class Api::V1::CharactersController < ApiController
  before_action :authenticate_user!

  def index
    @characters = current_user.characters.all
    render json: {data: @characters}
  end

  def create
    @character = current_user.characters.create!(character_params)
    render json: {data: @character}
  end

  private

  def character_params
    params.require(:character).permit(:name, :archetype)
  end
end