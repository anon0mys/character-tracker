module Api
  module V1
    # Typeahead for journal links: kind=people searches this game's characters and NPCs,
    # kind=things searches items, monsters and spells by name.
    class MentionsController < ApiController
      LIMIT = 5

      before_action :authenticate_user!

      def index
        game = current_user.games.find(params[:game_id])
        results = params[:kind] == "people" ? people(game) : things
        render json: { data: results }
      end

      private

      def people(game)
        named(game.characters).map do |character|
          result("Character", character, "#{character.archetype.name.to_s.capitalize} #{character.level}")
        end + named(game.npcs).map { |npc| result("Npc", npc, npc_detail(npc)) }
      end

      # "Human · Cleric"; an NPC with no class reads "Human · NPC".
      def npc_detail(npc)
        [npc.race.presence, npc.archetype ? npc.archetype.capitalize : "NPC"].compact.join(" · ")
      end

      def things
        named(Spell).map { |spell| result("Spell", spell, "#{spell.level} · #{spell.school}") } +
          named(Monster).map { |monster| result("Monster", monster, "CR #{monster.challenge_rating}") } +
          named(Item).map { |item| result("Item", item, item.quality.to_s.tr("_", " ")) }
      end

      def named(scope)
        scope.where("name ILIKE ?", "%#{ActiveRecord::Base.sanitize_sql_like(params[:q].to_s)}%").order(:name).limit(LIMIT)
      end

      def result(type, record, detail)
        { type:, id: record.id, label: record.name, detail: }
      end
    end
  end
end
