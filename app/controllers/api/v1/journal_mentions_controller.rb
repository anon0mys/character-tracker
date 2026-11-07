module Api
  module V1
    # Backlinks: the entries in this game that mention one person or thing.
    class JournalMentionsController < ApiController
      before_action :authenticate_user!

      def index
        game = current_user.games.find(params[:game_id])
        mentions = JournalMention.joins(:journal_entry)
                                 .where(journal_entries: { game_id: game.id })
                                 .where(mentionable_type:, mentionable_id: params[:id])
                                 .includes(:journal_entry)
                                 .order("journal_entries.number DESC")
        render json: { data: mentions.map { |mention| row(mention) } }
      end

      private

      def mentionable_type
        params.require(:type).presence_in(JournalMention::MENTIONABLE_TYPES) ||
          raise(ActionController::ParameterMissing, :type)
      end

      def row(mention)
        entry = mention.journal_entry
        { entry_id: entry.id, number: entry.number, title: entry.title, played_on: entry.played_on,
          label: mention.label, excerpt: mention.excerpt }
      end
    end
  end
end
