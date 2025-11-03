module Api
  module V1
    class SpellListsController < ApiController
      before_action :set_character

      def index
        @spell_lists = @character.spell_lists.includes(:spells).all
        render json:  SpellListSerializer.render(@spell_lists, root: :data)
      end

      def show
        @spell_list = @character.spell_lists.includes(:spells).find(params[:id])
        render json:  SpellListSerializer.render(@spell_list, root: :data)
      end

      def create
        @spell_list = @character.spell_lists.create!(spell_list_params)
        render json: SpellListSerializer.render(@spell_list, root: :data), status: :created
      end

      def update
        @spell_list = @character.spell_lists.find(params[:id])
        if @spell_list.update(spell_list_params)
          render json: SpellListSerializer.render(@spell_list, root: :data)
        else
          render json: { errors: @spell_list.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @character.spell_lists.find(params[:id]).destroy
        render json: {}, status: :accepted
      end

      def add_spell
        @spell_list = @character.spell_lists.find(params[:spell_list_id])
        @spell_list.add_spell(validated_spell)
        render json: SpellListSerializer.render(@spell_list, root: :data)
      end

      private

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
    end
  end
end
