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
    @character = current_user.characters.build(character_params)
    service = CharacterService.new(@character, character_params)
    
    if service.validate_and_update
      @character.assign_attributes(service.updated_params.except(:id, :created_at, :updated_at))
      if @character.save
        render json: CharacterSerializer.render(@character, root: :data)
      else
        render json: {errors: @character.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update
    @character = current_user.characters.find(params[:id])
    
    # Handle both nested character params and flat params
    # Use fetch to avoid ParameterMissing error when character key is missing
    update_params = begin
      if params[:character].present?
        character_params
      else
        # Allow direct parameter access for simpler updates (like just current_spell_list_id)
        params.permit(:current_spell_list_id)
      end
    rescue ActionController::ParameterMissing
      # If character param is required but missing, try to get current_spell_list_id directly
      params.permit(:current_spell_list_id)
    end
    
    service = CharacterService.new(@character, update_params)
    
    if service.validate_and_update
      if @character.update(service.updated_params.except(:id, :created_at, :updated_at))
        render json: CharacterSerializer.render(@character, root: :data)
      else
        render json: {errors: @character.errors.full_messages}, status: :unprocessable_entity
      end
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
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
