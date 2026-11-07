namespace :race_wars do
  desc "Import the Race Wars equipment snapshot into a campaign: GAME_ID=1 [REPLACE=1]"
  task import: :environment do
    game_id = ENV.fetch("GAME_ID") { abort "GAME_ID is required (the Race Wars campaign's id)" }
    RaceWars::Import.new(game: Game.find(game_id), replace: ENV["REPLACE"] == "1").call
  end
end
