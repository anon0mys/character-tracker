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

ActiveRecord::Schema.define(version: 2023_01_21_224228) do

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

  create_table "character_items", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "item_id"
    t.integer "quantity"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["character_id"], name: "index_character_items_on_character_id"
    t.index ["item_id"], name: "index_character_items_on_item_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name"
    t.string "archetype", default: "artificer", null: false
    t.integer "level", default: 1
    t.bigint "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "item_type"
    t.string "status"
    t.string "quality"
    t.integer "potential_damage"
    t.integer "total_charges"
    t.integer "value"
    t.integer "quantity", default: 1
    t.boolean "requires_attunement", default: false
    t.integer "ac"
    t.json "stat_bonuses"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "location_type", default: "zone", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "npcs", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "race"
    t.string "archetype", default: "artificer", null: false
    t.bigint "location_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["location_id"], name: "index_npcs_on_location_id", unique: true
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
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "character_items", "characters"
  add_foreign_key "character_items", "items"
  add_foreign_key "faction_locations", "factions"
  add_foreign_key "faction_locations", "locations"
  add_foreign_key "faction_npcs", "factions"
  add_foreign_key "faction_npcs", "npcs"
  add_foreign_key "npcs", "locations"
end
