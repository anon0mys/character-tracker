require "rails_helper"

describe "/api/v1/games/:game_id/journal_page_imports" do
  include ActiveJob::TestHelper

  let(:game) { create(:game) }
  let(:user) { create(:user) }
  let(:draft) do
    { "played_on" => "2022-07-23", "date_estimated" => false, "title" => "Decisions", "body" => "- notes",
      "unreadable" => [], "pages" => [1] }
  end

  around do |example|
    adapter = ActiveJob::Base.queue_adapter
    ActiveJob::Base.queue_adapter = :test
    example.run
  ensure
    ActiveJob::Base.queue_adapter = adapter
  end

  before do
    create(:user_game, game:, user:)
    sign_in(user)
  end

  def photo(name = "page.jpg")
    file = Tempfile.new([File.basename(name, ".*"), File.extname(name)])
    file.binmode
    file.write("fake jpeg bytes")
    file.rewind
    Rack::Test::UploadedFile.new(file.path, "image/jpeg", true, original_filename: name)
  end

  def ready_import(**)
    game.journal_page_imports.create!(created_by: user, status: "ready", entries: [draft], **)
  end

  it "stores the photos in order and starts reading them" do
    post api_v1_game_journal_page_imports_path(game), headers: @auth_headers.except("Content-Type"),
      params: { pages: [photo("one.jpg"), photo("two.jpg")] }

    expect(response).to have_http_status(:created)
    import = game.journal_page_imports.last
    expect(response.parsed_body["data"]).to include("status" => "transcribing", "page_count" => 2)
    expect(import.pages.pluck(:position, :content_type)).to eq([[0, "image/jpeg"], [1, "image/jpeg"]])
    expect(TranscribeJournalPagesJob).to have_been_enqueued.with(import.id)
  end

  it "needs at least one page" do
    post api_v1_game_journal_page_imports_path(game), headers: @auth_headers.except("Content-Type"), params: {}

    expect(response).to have_http_status(:unprocessable_entity)
    expect(game.journal_page_imports).to be_empty
  end

  it "lists the signed-in user's unfinished imports only" do
    mine = ready_import
    ready_import(status: "done")
    game.journal_page_imports.create!(created_by: create(:user))

    get api_v1_game_journal_page_imports_path(game), headers: @auth_headers

    expect(response.parsed_body["data"].pluck("id")).to eq([mine.id])
  end

  it "saves edits to the drafts, then confirms them into the journal" do
    import = ready_import

    patch api_v1_game_journal_page_import_path(game, import),
      headers: @auth_headers.merge("CONTENT_TYPE" => "application/json"),
      params: { entries: [draft.merge("title" => "Decisions, Decisions")] }.to_json
    expect(import.reload.entries.first["title"]).to eq("Decisions, Decisions")

    post confirm_api_v1_game_journal_page_import_path(game, import), headers: @auth_headers

    expect(response).to have_http_status(:ok)
    expect(game.journal_entries.count).to eq(1)
    entry = game.journal_entries.first
    expect(response.parsed_body["data"]["entry_ids"]).to eq([entry.id])
    expect(entry.title).to eq("Decisions, Decisions")
    expect(import.reload).to be_done
  end

  it "refuses to confirm a draft without a date" do
    import = ready_import(entries: [draft.merge("played_on" => nil)])

    post confirm_api_v1_game_journal_page_import_path(game, import), headers: @auth_headers

    expect(response).to have_http_status(:unprocessable_entity)
    expect(game.journal_entries).to be_empty
  end

  it "retries a failed import" do
    import = game.journal_page_imports.create!(created_by: user, status: "failed", error: "Claude declined")

    post retry_api_v1_game_journal_page_import_path(game, import), headers: @auth_headers

    expect(import.reload).to have_attributes(status: "transcribing", error: nil)
    expect(TranscribeJournalPagesJob).to have_been_enqueued.with(import.id)
  end

  it "won't retry one that is still being read" do
    import = game.journal_page_imports.create!(created_by: user)

    post retry_api_v1_game_journal_page_import_path(game, import), headers: @auth_headers

    expect(response).to have_http_status(:forbidden)
  end

  it "hides other people's imports" do
    theirs = game.journal_page_imports.create!(created_by: create(:user), status: "ready", entries: [draft])

    get api_v1_game_journal_page_import_path(game, theirs), headers: @auth_headers

    expect(response).to have_http_status(:not_found)
  end

  it "discards an import" do
    import = ready_import

    delete api_v1_game_journal_page_import_path(game, import), headers: @auth_headers

    expect(response).to have_http_status(:accepted)
    expect(JournalPageImport.exists?(import.id)).to be(false)
  end
end
