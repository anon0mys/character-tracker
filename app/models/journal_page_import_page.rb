# One photographed notebook page of a JournalPageImport, kept until the import
# is confirmed or discarded.
class JournalPageImportPage < ApplicationRecord
  CONTENT_TYPES = %w[image/jpeg image/png image/webp image/gif].freeze
  MAX_BYTES = 5.megabytes

  belongs_to :journal_page_import

  validates :content_type, inclusion: { in: CONTENT_TYPES }
  validates :data, presence: true
  validate :not_too_large

  private

  def not_too_large
    errors.add(:data, "is over #{MAX_BYTES / 1.megabyte} MB") if data && data.bytesize > MAX_BYTES
  end
end
