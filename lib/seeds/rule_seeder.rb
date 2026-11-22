module Seeds
  # Loads lib/seeds/rule_data.json (one rule per line, built by
  # `rake rules:collect`). Idempotent: matches on slug, and removes rules that
  # are no longer in the file.
  class RuleSeeder
    FILE = Rails.root.join("lib/seeds/rule_data.json")

    def self.call
      slugs = File.foreach(FILE).map do |line|
        data = JSON.parse(line)
        Rule.find_or_initialize_by(slug: data["slug"]).update!(data)
        data["slug"]
      end
      Rule.where.not(slug: slugs).delete_all
      slugs.size
    end
  end
end
