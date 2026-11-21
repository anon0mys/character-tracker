module Api
  module V1
    # Photographed notebook pages into journal entries (JournalPageImport). The
    # person uploads photos, polls while Claude reads them, edits the drafts,
    # then confirms to add them. Imports belong to whoever started them.
    class JournalPageImportsController < ApiController
      include CampaignMembership

      before_action :authenticate_user!
      before_action :set_game
      before_action :membership
      before_action :set_import, except: %i[index create]

      # The signed-in user's imports still in progress here, newest first.
      def index
        imports = own_imports.unfinished.order(created_at: :desc)
        render json: JournalPageImportSerializer.render(imports, root: :data)
      end

      def show
        render json: JournalPageImportSerializer.render(@import, root: :data)
      end

      # multipart: pages[] = photos, in page order.
      def create
        files = Array(params[:pages]).select { |file| file.respond_to?(:read) }
        unless files.size.between?(1, JournalPageImport::MAX_PAGES)
          return render json: { errors: ["Upload between 1 and #{JournalPageImport::MAX_PAGES} pages"] },
            status: :unprocessable_entity
        end

        import = JournalPageImport.transaction do
          own_imports.create!(page_count: files.size).tap do |record|
            files.each_with_index do |file, index|
              record.pages.create!(position: index, content_type: file.content_type, data: file.read)
            end
          end
        end
        TranscribeJournalPagesJob.perform_later(import.id)
        render json: JournalPageImportSerializer.render(import, root: :data), status: :created
      end

      # Saves edits to the drafts while reviewing.
      def update
        raise ApiController::Forbidden, "This import isn't ready to edit" unless @import.ready?

        @import.update!(entries: entries_param)
        render json: JournalPageImportSerializer.render(@import, root: :data)
      end

      def retry_transcription
        raise ApiController::Forbidden, "This import is still being read" unless @import.retryable?

        @import.update!(status: "transcribing", error: nil)
        TranscribeJournalPagesJob.perform_later(@import.id)
        render json: JournalPageImportSerializer.render(@import, root: :data)
      end

      # Adds the drafts (optionally as just edited) to the journal.
      def confirm
        @import.entries = entries_param if params.key?(:entries)
        created = @import.confirm!
        render json: { data: { entry_ids: created.map(&:id) } }
      rescue JournalPageImport::NotReady => e
        raise ApiController::Forbidden, e.message
      end

      def destroy
        @import.destroy!
        render json: {}, status: :accepted
      end

      private

      def own_imports
        @game.journal_page_imports.where(created_by: current_user)
      end

      def set_import
        @import = own_imports.find(params[:id])
      end

      def entries_param
        params.permit(entries: [:played_on, :date_estimated, :title, :body, { unreadable: [], pages: [] }])
              .fetch(:entries, []).map(&:to_h)
      end
    end
  end
end
