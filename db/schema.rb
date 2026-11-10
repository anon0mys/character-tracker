# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2026_11_07_100006) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "archetypes", force: :cascade do |t|
    t.string "name", null: false
    t.string "hit_die"
    t.string "spellcasting_ability"
    t.string "hit_points_at_1st_level"
    t.string "hit_points_at_higher_levels"
    t.jsonb "proficiencies", default: {}, null: false
    t.jsonb "equipment", default: [], null: false
    t.jsonb "spellcasting", default: {}, null: false
    t.jsonb "class_features", default: [], null: false
    t.string "subclass_label"
    t.string "source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_archetypes_on_name", unique: true
  end

  create_table "attacks", force: :cascade do |t|
    t.string "name"
    t.string "bonus"
    t.text "description"
    t.bigint "character_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "damage"
    t.string "action_type", default: "action", null: false
    t.boolean "extra_attack", default: false, null: false
    t.jsonb "riders", default: [], null: false
    t.integer "loadout_ids", default: [], null: false, array: true
    t.index ["character_id"], name: "index_attacks_on_character_id"
  end

  create_table "backgrounds", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug"
    t.string "source"
    t.text "description"
    t.string "skill_proficiencies"
    t.string "tool_proficiencies"
    t.string "languages"
    t.text "equipment"
    t.jsonb "features", default: [], null: false
    t.jsonb "variants", default: [], null: false
    t.jsonb "characteristics", default: {}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_backgrounds_on_name", unique: true
  end

  create_table "character_feats", force: :cascade do |t|
    t.bigint "character_id", null: false
    t.bigint "feat_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id", "feat_id"], name: "index_character_feats_on_character_id_and_feat_id", unique: true
    t.index ["character_id"], name: "index_character_feats_on_character_id"
    t.index ["feat_id"], name: "index_character_feats_on_feat_id"
  end

  create_table "character_trackers", force: :cascade do |t|
    t.bigint "character_id", null: false
    t.string "name", null: false
    t.integer "max_uses", null: false
    t.integer "current_uses", default: 0, null: false
    t.string "reset_on", null: false
    t.string "category"
    t.text "description"
    t.integer "sort_order", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_character_trackers_on_character_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.string "archetype", default: "artificer", null: false
    t.integer "level", default: 1
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "game_id"
    t.string "race"
    t.string "background"
    t.string "alignment"
    t.integer "age"
    t.integer "speed", default: 30
    t.integer "initiative_bonus", default: 0
    t.integer "ac_bonus", default: 0
    t.string "proficiencies", default: [], array: true
    t.integer "strength", default: 10
    t.integer "dexterity", default: 10
    t.integer "constitution", default: 10
    t.integer "intelligence", default: 10
    t.integer "wisdom", default: 10
    t.integer "charisma", default: 10
    t.integer "current_hitpoints"
    t.bigint "current_spell_list_id"
    t.integer "temp_hitpoints", default: 0, null: false
    t.integer "max_hitpoints_bonus", default: 0, null: false
    t.integer "hit_dice_remaining"
    t.integer "inspiration", default: 0, null: false
    t.integer "death_save_successes", default: 0, null: false
    t.integer "death_save_failures", default: 0, null: false
    t.integer "exhaustion", default: 0, null: false
    t.jsonb "spell_slots_used", default: {}, null: false
    t.string "concentration_spell"
    t.integer "copper", default: 0, null: false
    t.integer "silver", default: 0, null: false
    t.integer "electrum", default: 0, null: false
    t.integer "gold", default: 0, null: false
    t.integer "platinum", default: 0, null: false
    t.text "notes"
    t.string "conditions", default: [], null: false, array: true
    t.string "expertise", default: [], null: false, array: true
    t.jsonb "custom_skills", default: [], null: false
    t.string "subclass"
    t.text "trait"
    t.text "ideal"
    t.text "flaw"
    t.text "bond"
    t.string "languages", default: [], null: false, array: true
    t.bigint "archetype_id"
    t.bigint "race_id"
    t.bigint "background_id"
    t.string "subrace"
    t.index ["archetype_id"], name: "index_characters_on_archetype_id"
    t.index ["background_id"], name: "index_characters_on_background_id"
    t.index ["current_spell_list_id"], name: "index_characters_on_current_spell_list_id"
    t.index ["game_id"], name: "index_characters_on_game_id"
    t.index ["race_id"], name: "index_characters_on_race_id"
    t.index ["user_id"], name: "index_characters_on_user_id"
  end

  create_table "faction_locations", force: :cascade do |t|
    t.bigint "faction_id"
    t.bigint "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["faction_id"], name: "index_faction_locations_on_faction_id", unique: true
    t.index ["location_id"], name: "index_faction_locations_on_location_id", unique: true
  end

  create_table "faction_npcs", force: :cascade do |t|
    t.bigint "npc_id"
    t.bigint "faction_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["faction_id"], name: "index_faction_npcs_on_faction_id", unique: true
    t.index ["npc_id"], name: "index_faction_npcs_on_npc_id", unique: true
  end

  create_table "factions", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "feats", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug"
    t.string "source"
    t.string "prerequisite"
    t.text "description"
    t.jsonb "benefits", default: [], null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_feats_on_name", unique: true
  end

  create_table "features", force: :cascade do |t|
    t.bigint "character_id", null: false
    t.string "category", default: "other", null: false
    t.string "name", null: false
    t.text "description"
    t.integer "tracker_id"
    t.integer "position", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_features_on_character_id"
  end

  create_table "games", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "status", default: "active", null: false
    t.datetime "start_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.jsonb "hp_thresholds", default: {"mangled"=>0.25, "bloodied"=>0.5}, null: false
  end

  create_table "holdings", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.bigint "item_id", null: false
    t.string "holder_type"
    t.bigint "holder_id"
    t.integer "quantity", default: 1, null: false
    t.string "status", default: "carried", null: false
    t.text "notes"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id"], name: "index_holdings_on_game_id"
    t.index ["holder_type", "holder_id"], name: "index_holdings_on_holder"
    t.index ["item_id"], name: "index_holdings_on_item_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "item_type"
    t.string "quality"
    t.integer "potential_damage"
    t.integer "total_charges"
    t.integer "value"
    t.boolean "requires_attunement", default: false
    t.integer "ac"
    t.json "stat_bonuses"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "source"
    t.boolean "homebrew", default: false, null: false
    t.string "tags", default: [], null: false, array: true
    t.index ["homebrew"], name: "index_items_on_homebrew"
    t.index ["name"], name: "index_items_on_name", unique: true
  end

  create_table "journal_entries", force: :cascade do |t|
    t.bigint "game_id", null: false
    t.integer "number", null: false
    t.date "played_on", null: false
    t.string "title"
    t.jsonb "body", default: {}, null: false
    t.binary "ydoc_state"
    t.integer "update_seq", default: 0, null: false
    t.integer "compacted_through", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id", "number"], name: "index_journal_entries_on_game_id_and_number", unique: true
    t.index ["game_id"], name: "index_journal_entries_on_game_id"
  end

  create_table "journal_entry_updates", force: :cascade do |t|
    t.bigint "journal_entry_id", null: false
    t.integer "seq", null: false
    t.binary "payload", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["journal_entry_id", "seq"], name: "index_journal_entry_updates_on_journal_entry_id_and_seq", unique: true
    t.index ["journal_entry_id"], name: "index_journal_entry_updates_on_journal_entry_id"
  end

  create_table "journal_mentions", force: :cascade do |t|
    t.bigint "journal_entry_id", null: false
    t.string "mentionable_type", null: false
    t.bigint "mentionable_id", null: false
    t.string "label", null: false
    t.text "excerpt"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["journal_entry_id", "mentionable_type", "mentionable_id"], name: "index_journal_mentions_on_entry_and_mentionable", unique: true
    t.index ["journal_entry_id"], name: "index_journal_mentions_on_journal_entry_id"
    t.index ["mentionable_type", "mentionable_id"], name: "index_journal_mentions_on_mentionable"
  end

  create_table "loadouts", force: :cascade do |t|
    t.bigint "character_id", null: false
    t.string "name", null: false
    t.boolean "active", default: false, null: false
    t.jsonb "modifiers", default: {"notes"=>"", "ac_bonus"=>0, "attack_ids"=>[], "speed_bonus"=>0}, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_loadouts_on_character_id"
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "location_type", default: "zone", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "game_id"
    t.bigint "parent_id"
    t.index ["game_id"], name: "index_locations_on_game_id"
    t.index ["parent_id"], name: "index_locations_on_parent_id"
  end

  create_table "monsters", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug"
    t.string "size"
    t.string "creature_type"
    t.string "subtype"
    t.string "alignment"
    t.integer "armor_class"
    t.integer "hit_points"
    t.string "challenge_rating"
    t.integer "strength"
    t.integer "dexterity"
    t.integer "constitution"
    t.integer "intelligence"
    t.integer "wisdom"
    t.integer "charisma"
    t.text "description"
    t.jsonb "stat_block", default: {}, null: false
    t.string "source"
    t.string "license_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["challenge_rating"], name: "index_monsters_on_challenge_rating"
    t.index ["creature_type"], name: "index_monsters_on_creature_type"
    t.index ["name"], name: "index_monsters_on_name", unique: true
  end

  create_table "npcs", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "race"
    t.string "archetype"
    t.bigint "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "game_id"
    t.index ["game_id"], name: "index_npcs_on_game_id"
    t.index ["location_id"], name: "index_npcs_on_location_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug"
    t.string "category"
    t.string "source"
    t.text "description"
    t.string "size"
    t.integer "speed"
    t.jsonb "traits", default: [], null: false
    t.jsonb "subraces", default: [], null: false
    t.jsonb "alternate_versions", default: [], null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["category"], name: "index_races_on_category"
    t.index ["name"], name: "index_races_on_name", unique: true
  end

  create_table "spell_list_items", force: :cascade do |t|
    t.bigint "spell_list_id"
    t.bigint "spell_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["spell_id"], name: "index_spell_list_items_on_spell_id"
    t.index ["spell_list_id"], name: "index_spell_list_items_on_spell_list_id"
  end

  create_table "spell_lists", force: :cascade do |t|
    t.string "name"
    t.bigint "character_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_spell_lists_on_character_id"
  end

  create_table "spells", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.text "archetypes", default: [], array: true
    t.string "level", default: "cantrip", null: false
    t.string "school", default: "abjuration", null: false
    t.string "casting_time"
    t.string "range"
    t.string "duration"
    t.string "components", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name"], name: "index_spells_on_name", unique: true
  end

  create_table "subclasses", force: :cascade do |t|
    t.bigint "archetype_id", null: false
    t.string "name", null: false
    t.string "slug"
    t.text "description"
    t.jsonb "features", default: [], null: false
    t.string "source"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["archetype_id", "name"], name: "index_subclasses_on_archetype_id_and_name", unique: true
    t.index ["archetype_id"], name: "index_subclasses_on_archetype_id"
  end

  create_table "user_games", force: :cascade do |t|
    t.string "role", default: "player", null: false
    t.string "status", default: "active", null: false
    t.bigint "user_id"
    t.bigint "game_id"
    t.datetime "joined"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["game_id"], name: "index_user_games_on_game_id"
    t.index ["user_id", "game_id"], name: "index_user_games_on_user_id_and_game_id", unique: true
    t.index ["user_id"], name: "index_user_games_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "current_character_id"
    t.string "username"
    t.index "lower((username)::text)", name: "index_users_on_lower_username", unique: true
    t.index ["current_character_id"], name: "index_users_on_current_character_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "attacks", "characters"
  add_foreign_key "character_feats", "characters"
  add_foreign_key "character_feats", "feats"
  add_foreign_key "character_trackers", "characters"
  add_foreign_key "characters", "archetypes"
  add_foreign_key "characters", "backgrounds"
  add_foreign_key "characters", "games"
  add_foreign_key "characters", "races"
  add_foreign_key "faction_locations", "factions"
  add_foreign_key "faction_locations", "locations"
  add_foreign_key "faction_npcs", "factions"
  add_foreign_key "faction_npcs", "npcs"
  add_foreign_key "features", "characters"
  add_foreign_key "holdings", "games"
  add_foreign_key "holdings", "items"
  add_foreign_key "journal_entries", "games"
  add_foreign_key "journal_entry_updates", "journal_entries", on_delete: :cascade
  add_foreign_key "journal_mentions", "journal_entries", on_delete: :cascade
  add_foreign_key "loadouts", "characters"
  add_foreign_key "locations", "games"
  add_foreign_key "locations", "locations", column: "parent_id"
  add_foreign_key "npcs", "games"
  add_foreign_key "npcs", "locations"
  add_foreign_key "subclasses", "archetypes"
  add_foreign_key "users", "characters", column: "current_character_id", on_delete: :nullify
end
