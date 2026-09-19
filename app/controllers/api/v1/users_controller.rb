module Api
  module V1
    class UsersController < ApiController
      before_action :authenticate_user!

      def me
        render json: { data: UserSerializer.render_as_hash(current_user) }
      end

      def set_current_character
        character_id = params[:character_id]
        if character_id.blank?
          current_user.update!(current_character: nil)
        else
          character = current_user.characters.find_by(id: character_id)
          return render json: { errors: ["Character not found"] }, status: :not_found unless character

          current_user.update!(current_character: character)
        end
        render json: { data: UserSerializer.render_as_hash(current_user) }
      end
    end
  end
end
