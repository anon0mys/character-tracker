class Api::V1::SpellListsController < ApiController
  before_action :set_character
  rescue_from ActiveRecord::RecordNotFound, with: :invalid_record

  def index
    @spell_lists = @character.spell_lists.all
    render json: {spell_lists: @spell_lists}
  end

  def show
    @spell_list = @character.spell_lists.find(params[:id])
    render json: {spell_list: render_spell_list(@spell_list)}
  end

  def create
    @spell_list = @character.spell_lists.create!(spell_list_params)
    render json: {spell_list: render_spell_list(@spell_list)}, status: :created
  end

  def update
    @spell_list = @character.spell_lists.find(params[:id])
    if @spell_list.update(spell_list_params)
      render json: {spell_list: render_spell_list(@spell_list)}
    else
      render json: {errors: 'Invalid attributes'}, status: :unprocessable_entity
    end
  end

  def destroy
    @character.spell_lists.find(params[:id]).destroy
    render json: {}, status: :accepted
  end

  def add_spell
    @spell_list = @character.spell_lists.find(params[:spell_list_id])
    @spell_list.add_spell(validated_spell)
    render json: {spell_list: render_spell_list(@spell_list)}
  end

  private

  def render_spell_list(spell_list)
    {
      name: spell_list.name,
      spells: spell_list.spells
    }
  end

  def spell_list_params
    params.require(:spell_list).permit(:name)
  end

  def validated_spell
    Spell.find(spell_params[:id])
  end

  def spell_params
    params.require(:spell).permit(:id)
  end

  def set_character
    @character = current_user.characters.find(params[:character_id])
  end

  def invalid_record(exception)
    render json: { errors: exception.message }, status: :unprocessable_entity
  end
end