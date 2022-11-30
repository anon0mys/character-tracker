class Api::V1::SpellsController < ApiController
  before_action :authenticate_user!

  def index
    response = paginate(Spell.filter(filtering_params))
    render json: response
  end

  private

  def filtering_params
    params.slice(:archetype, :level, :school, :name)
  end
end