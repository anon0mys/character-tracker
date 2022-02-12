class Api::V1::SpellsController < ApiController
  before_action :authenticate_user!

  def index
    @pagy, @spells = pagy(Spell.filter(filtering_params))
    render json: { data: @spells }
  end

  private

  def filtering_params
    params.slice(:archetype)
  end
end