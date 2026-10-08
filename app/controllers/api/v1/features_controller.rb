module Api
  module V1
    class FeaturesController < ApiController
      before_action :authenticate_user!
      before_action :set_character

      def index
        render json: FeatureSerializer.render(@character.features.order(:position, :id), root: :data)
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

      # Seed "class" features from the archetype's features up to the character's level,
      # skipping any already present by name.
      def import_class
        existing = @character.features.where(category: "class").pluck(:name).to_set
        imported = []
        (1..@character.level).each do |lvl|
          @character.archetype.features_at_level(lvl).each do |feature|
            name = feature["name"]
            next if name.blank? || existing.include?(name)

            existing << name
            imported << @character.features.create!(
              category: "class", name:, description: feature["description"],
            )
          end
        end
        render json: FeatureSerializer.render(imported, root: :data)
      end

      def import_subclass
        subclass = @character.archetype.try(:subclasses)&.find_by("lower(name) = ?", @character.subclass.to_s.downcase)
        unless subclass
          return render json: { errors: ["No matching subclass for this character"] },
            status: :unprocessable_entity
        end

        existing = @character.features.where(category: "subclass").pluck(:name).to_set
        imported = (subclass.features || []).filter_map do |feature|
          name = feature["name"]
          next if name.blank? || existing.include?(name)

          existing << name
          @character.features.create!(category: "subclass", name:, description: feature["description"])
        end
        render json: FeatureSerializer.render(imported, root: :data)
      end

      private

      def set_character
        @character = current_user.characters.find(params[:character_id])
      end

      def feature_params
        params.require(:feature).permit(:category, :name, :description, :tracker_id, :position)
      end
    end
  end
end
