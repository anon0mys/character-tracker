module Api
  module V1
    class CharacterFeatsController < ApiController
      before_action :authenticate_user!
      before_action :set_character

      def create
        character_feat = @character.character_feats.build(feat_id: params[:feat_id])
        if character_feat.save
          render json: CharacterFeatSerializer.render(character_feat, root: :data)
        else
          render json: { errors: character_feat.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @character.character_feats.find(params[:id]).destroy
        render json: {}, status: :accepted
      end

      private

      def set_character
        @character = current_user.characters.find(params[:character_id])
      end
    end
  end
end
