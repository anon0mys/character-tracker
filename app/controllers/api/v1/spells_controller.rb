class Api::V1::SpellsController < ApiController
  before_action :authenticate_user!

  def index
    response = paginate(Spell.filter(filtering_params))
    render json: response
  end

  private

  def filtering_params
    filters = params.slice(:archetype, :level, :school, :name)
    if filters[:archetype]
      filters[:archetype] = filters[:archetype].split(',')
    end
    if filters[:level]
      filters[:level] = filters[:level].split(',')
    end
    if filters[:school]
      filters[:school] = filters[:school].split(',')
    end
    filters
  end
end
