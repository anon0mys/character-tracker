namespace :rules do
  desc "Rebuild lib/seeds/rule_data.json from the SRD 5.1"
  task collect: :environment do
    require Rails.root.join("lib/seeds/rule_seeder")
    require Rails.root.join("lib/seeds/rule_collector")
    puts "#{Seeds::RuleCollector.call} rules written"
  end

  desc "Load lib/seeds/rule_data.json into the database"
  task seed: :environment do
    require Rails.root.join("lib/seeds/rule_seeder")
    puts "#{Seeds::RuleSeeder.call} rules loaded"
  end
end
