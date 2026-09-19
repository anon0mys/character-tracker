module Api
  module V1
    class CharacterItemsController < ApiController
      before_action :authenticate_user!

      def index
        character = current_user.characters.find(params[:character_id])
        character_items = character.character_items.includes(:item)
        render json: CharacterItemSerializer.render(character_items, root: :data)
      end
    end
  end
end
