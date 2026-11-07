module Api
  module V1
    class LoadoutsController < ApiController
      before_action :authenticate_user!
      before_action :set_character, except: :index
      before_action :set_viewable_character, only: :index

      def index
        render json: LoadoutSerializer.render(@character.loadouts.order(:id), root: :data)
      end

      def create
        loadout = @character.loadouts.build(loadout_params)
        if loadout.save
          render json: LoadoutSerializer.render(loadout, root: :data)
        else
          render json: { errors: loadout.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        loadout = @character.loadouts.find(params[:id])
        if loadout.update(loadout_params)
          render json: LoadoutSerializer.render(loadout, root: :data)
        else
          render json: { errors: loadout.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @character.loadouts.find(params[:id]).destroy
        render json: {}, status: :accepted
      end

      # Make exactly this loadout active; deactivate the rest.
      def activate
        loadout = @character.loadouts.find(params[:id])
        Loadout.transaction do
          @character.loadouts.where.not(id: loadout.id).update_all(active: false) # rubocop:disable Rails/SkipsModelValidations
          loadout.update!(active: true)
        end
        render json: LoadoutSerializer.render(@character.loadouts.order(:id), root: :data)
      end

      private

      def set_character
        @character = current_user.characters.find(params[:character_id])
      end

      def set_viewable_character
        @character = viewable_characters.find(params[:character_id])
      end

      def loadout_params
        params.require(:loadout).permit(:name, :active,
          modifiers: [:speed_bonus, :ac_bonus, :notes, { attack_ids: [] }])
      end
    end
  end
end
