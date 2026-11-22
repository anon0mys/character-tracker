# Page furniture the old dnd5e.wikidot.com scrapers swept up: the ad script,
# and after it the site footer, cookie and analytics code. It always starts at
# the ad call and runs to the end of the text, so everything from there on goes.
module WikiJunk
  MARKER = "window['nitroAds']".freeze
  TAIL = /\s*#{Regexp.escape(MARKER)}.*\z/m

  module_function

  # The value with the junk removed from every string in it (Strings, and the
  # Arrays and Hashes of jsonb columns).
  def clean(value)
    case value
    when String then value.sub(TAIL, "")
    when Array then value.map { |v| clean(v) }
    when Hash then value.transform_values { |v| clean(v) }
    else value
    end
  end

  # Every text, string and json column holding the junk, cleaned in place.
  # Returns { "table.column" => rows }. dry_run: only count.
  def scrub!(dry_run: true)
    conn = ActiveRecord::Base.connection
    found = {}
    conn.tables.each do |table|
      columns = conn.columns(table)
      next unless columns.any? { |c| c.name == "id" } # schema_migrations and the like

      columns.select { |c| %i[text string json jsonb].include?(c.type) }.each do |column|
        rows = rows_with_junk(conn, table, column.name)
        next if rows.empty?

        found["#{table}.#{column.name}"] = rows.size
        rows.each { |id, raw| write(conn, table, column, id, raw) } unless dry_run
      end
    end
    found
  end

  def rows_with_junk(conn, table, column)
    conn.select_rows(<<~SQL.squish)
      SELECT id, #{conn.quote_column_name(column)} FROM #{conn.quote_table_name(table)}
      WHERE #{conn.quote_column_name(column)}::text LIKE #{conn.quote("%#{MARKER}%")}
    SQL
  end

  def write(conn, table, column, id, raw)
    json = %i[json jsonb].include?(column.type)
    value = clean(json ? JSON.parse(raw) : raw)
    value = value.to_json if json
    conn.exec_update(<<~SQL.squish)
      UPDATE #{conn.quote_table_name(table)} SET #{conn.quote_column_name(column.name)} = #{conn.quote(value)}
      WHERE id = #{conn.quote(id)}
    SQL
  end
end
