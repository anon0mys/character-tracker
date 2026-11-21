# A photo import as its owner sees it: where it is, and its draft entries.
class JournalPageImportSerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :page_count, :entries, :created_at, :updated_at

  # Blueprinter passes (object, options), so &:display_status would break.
  field(:status) { |import| import.display_status } # rubocop:disable Style/SymbolProc
  field(:error) { |import| import.display_error } # rubocop:disable Style/SymbolProc
end
