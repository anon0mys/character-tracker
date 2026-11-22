namespace :data do
  desc "Remove scraped wiki ad/footer junk from the database (reports only; APPLY=1 to write)"
  task scrub_wiki_junk: :environment do
    require Rails.root.join("lib/wiki_junk")
    apply = ENV["APPLY"] == "1"
    found = WikiJunk.scrub!(dry_run: !apply)
    found.each { |column, rows| puts "#{column}: #{rows} rows" }
    if found.empty?
      puts "No junk found."
    elsif apply
      puts "Cleaned."
    else
      puts "Dry run; run again with APPLY=1 to clean."
    end
  end
end
