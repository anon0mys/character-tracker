class Api::V1::CharactersController < ApiController
  before_action :authenticate_user!

  def index
    @characters = current_user.characters.all
    render json: CharacterSerializer.render(@characters, root: :data)
  end

  def show
    @character = current_user.characters.includes(:current_spell_list).find(params[:id])
    render json: CharacterSerializer.render(@character, root: :data)
  end

  def create
    @character = current_user.characters.create!(character_params)
    render json: CharacterSerializer.render(@character, root: :data)
  end

  def update
    @character = current_user.characters.find(params[:id])
    if @character.update(character_params)
      render json: CharacterSerializer.render(@character, root: :data)
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
    params.require(:character).permit(
      :name,
      :archetype,
      :game_id,
      :race,
      :level,
      :background,
      :alignment,
      :age,
      :speed,
      :initiative_bonus,
      :ac_bonus,
      :strength,
      :dexterity,
      :constitution,
      :intelligence,
      :wisdom,
      :charisma,
      :current_spell_list_id,
      proficiencies: [],
    )
  end
end
