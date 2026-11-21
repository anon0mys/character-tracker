# Full-text search over a game's journal, with English stemming. All the words
# must appear; the last one is matched as a prefix, so results keep up while a
# word is still being typed ("spid" finds "spiders"). Hits come best first, each with a `snippet` attribute: the matching
# text with HIGHLIGHT around the matched words.
#
#   JournalSearch.call(game.journal_entries, "trikar blight")
class JournalSearch
  HIGHLIGHT = ["⟦", "⟧"].freeze
  # The expression the GIN index in AddSearchToJournalEntries covers; it must
  # stay identical or Postgres scans every entry.
  VECTOR = "(setweight(to_tsvector('english'::regconfig, COALESCE((journal_entries.title)::text, ''::text)), " \
           "'A'::\"char\") || " \
           "setweight(to_tsvector('english'::regconfig, journal_entries.search_text), 'B'::\"char\"))".freeze
  MAX_TERMS = 8
  HEADLINE_OPTIONS = "StartSel=#{HIGHLIGHT[0]}, StopSel=#{HIGHLIGHT[1]}, MaxFragments=2, " \
                     "MinWords=8, MaxWords=24, FragmentDelimiter=\" … \"".freeze

  def self.call(scope, text)
    new(scope, text).call
  end

  def initialize(scope, text)
    @scope = scope
    @terms = text.to_s.scan(/[\p{L}\p{N}]+/).first(MAX_TERMS)
  end

  def call
    return @scope.none if @terms.empty?

    @scope.where("#{VECTOR} @@ #{tsquery}")
          .select("journal_entries.*", "#{headline} AS snippet")
          .reorder(Arel.sql("ts_rank(#{VECTOR}, #{tsquery}) DESC, journal_entries.number DESC"))
  end

  private

  # Terms are letters and digits only, so they can't carry tsquery operators;
  # they are still bound as a literal.
  def tsquery
    @tsquery ||= ActiveRecord::Base.sanitize_sql_array(
      ["to_tsquery('english', ?)", [*@terms[0...-1], "#{@terms.last}:*"].join(" & ")],
    )
  end

  def headline
    ActiveRecord::Base.sanitize_sql_array(
      ["ts_headline('english', journal_entries.search_text, #{tsquery}, ?)", HEADLINE_OPTIONS],
    )
  end
end
