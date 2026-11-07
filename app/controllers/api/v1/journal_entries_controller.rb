module Api
  module V1
    class JournalEntriesController < ApiController
      before_action :authenticate_user!
      before_action :set_game

      def index
        entries = @game.journal_entries.includes(:journal_mentions).order(number: :desc)
        render json: JournalEntrySerializer.render(entries, view: :list, root: :data)
      end

      def show
        render json: JournalEntrySerializer.render(find_entry, view: :detail, root: :data)
      end

      def create
        entry = @game.journal_entries.create!(entry_params)
        render json: JournalEntrySerializer.render(entry, view: :detail, root: :data), status: :created
      end

      def update
        entry = find_entry
        entry.update!(entry_params)
        render json: JournalEntrySerializer.render(entry, view: :detail, root: :data)
      end

      def destroy
        find_entry.destroy!
        render json: {}, status: :accepted
      end

      private

      def set_game
        @game = current_user.games.find(params[:game_id])
      end

      def find_entry
        @game.journal_entries.find(params[:id])
      end

      def entry_params
        params.fetch(:journal_entry, {}).permit(:title, :played_on, :number)
      end
    end
  end
end
