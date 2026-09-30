module Api
  module V1
    class AttacksController < ApiController
      before_action :authenticate_user!
      before_action :set_character

      def index
        @attacks = @character.attacks
        render json: AttackSerializer.render(@attacks, root: :data)
      end

      def create
        @attack = @character.attacks.build(attack_params)
        if @attack.save
          render json: AttackSerializer.render(@attack, root: :data)
        else
          render json: { errors: @attack.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        @attack = @character.attacks.find(params[:id])
        if @attack.update(attack_params)
          render json: AttackSerializer.render(@attack, root: :data)
        else
          render json: { errors: @attack.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @character.attacks.find(params[:id]).destroy
        render json: {}, status: :accepted
      end

      private

      def set_character
        @character = current_user.characters.find(params[:character_id])
      end

      def attack_params
        params.require(:attack).permit(:name, :description, :bonus, :damage,
          :action_type, :extra_attack, riders: %i[name tag damage note], loadout_ids: [])
      end
    end
  end
end
