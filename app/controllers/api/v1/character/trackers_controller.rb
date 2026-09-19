module Api
  module V1
    module Character
      class TrackersController < ApiController
        before_action :authenticate_user!
        before_action :set_character

        def index
          render json: ::Character::TrackerSerializer.render(@character.character_trackers.order(:sort_order, :id),
            root: :data)
        end

        def create
          tracker = @character.character_trackers.build(tracker_params)
          if tracker.save
            render json: ::Character::TrackerSerializer.render(tracker, root: :data)
          else
            render json: { errors: tracker.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          tracker = @character.character_trackers.find(params[:id])
          if tracker.update(tracker_params)
            render json: ::Character::TrackerSerializer.render(tracker, root: :data)
          else
            render json: { errors: tracker.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @character.character_trackers.find(params[:id]).destroy
          render json: {}, status: :accepted
        end

        private

        def set_character
          @character = current_user.characters.find(params[:character_id])
        end

        def tracker_params
          params.require(:character_tracker).permit(
            :name, :max_uses, :current_uses, :reset_on, :category, :description, :sort_order
          )
        end
      end
    end
  end
end
