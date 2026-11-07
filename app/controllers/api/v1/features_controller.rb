module Api
  module V1
    class FeaturesController < ApiController
      before_action :authenticate_user!
      before_action :set_character, except: :index
      before_action :set_viewable_character, only: :index

      # Derived rows (class, subclass, race, background) are projected from the
      # compendium; feat rows come from the character_feats join; custom rows
      # are the character's own. Each row says which via `origin`.
      def index
        derived = DerivedFeatures.for(@character).map { |row| row.to_h.merge(id: nil, origin: "derived") }
        feats = CharacterFeatSerializer.render_as_hash(@character.character_feats.includes(:feat).order(:id))
        custom = FeatureSerializer.render_as_hash(@character.features.order(:position, :id))
        render json: { data: derived + feats + custom }
      end

      def create
        feature = @character.features.build(feature_params)
        if feature.save
          render json: FeatureSerializer.render(feature, root: :data)
        else
          render json: { errors: feature.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        feature = @character.features.find(params[:id])
        if feature.update(feature_params)
          render json: FeatureSerializer.render(feature, root: :data)
        else
          render json: { errors: feature.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @character.features.find(params[:id]).destroy
        render json: {}, status: :accepted
      end

      private

      def set_character
        @character = current_user.characters.find(params[:character_id])
      end

      def set_viewable_character
        @character = viewable_characters.find(params[:character_id])
      end

      def feature_params
        params.require(:feature).permit(:category, :name, :description, :tracker_id, :position)
      end
    end
  end
end
