require "rails_helper"

describe "GET /api/v1/games/:game_id/mentions" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  it "finds people among this game's characters only" do
    create(:character, game:, name: "Venna", archetype: :cleric, level: 12)
    create(:character, name: "Venna Elsewhere")

    get api_v1_game_mentions_path(game), headers: @auth_headers, params: { kind: "people", q: "ven" }

    venna = { "type" => "Character", "id" => game.characters.first.id, "label" => "Venna", "detail" => "Cleric 12" }
    expect(response.parsed_body["data"]).to eq([venna])
  end

  it "finds this game's NPCs after its characters" do
    venna = create(:character, game:, name: "Venna", archetype: :cleric, level: 12)
    archivist = create(:npc, game:, name: "Venn the Archivist", race: "Elf", archetype: nil, location: nil)
    create(:npc, game: create(:game), name: "Venn Elsewhere", location: nil)

    get api_v1_game_mentions_path(game), headers: @auth_headers, params: { kind: "people", q: "ven" }

    expected = [["Character", venna.id, "Cleric 12"], ["Npc", archivist.id, "Elf · NPC"]]
    expect(response.parsed_body["data"].map { |r| r.values_at("type", "id", "detail") }).to eq(expected)
  end

  it "finds things across spells, monsters and items" do
    spell = create(:spell, name: "Fireball", level: "3", school: "evocation")
    monster = create(:monster, name: "Fire Elemental", challenge_rating: "5")
    item = create(:item, name: "Necklace of Fireballs")
    create(:item, name: "Rope")

    get api_v1_game_mentions_path(game), headers: @auth_headers, params: { kind: "things", q: "fire" }

    expected = [["Spell", spell.id], ["Monster", monster.id], ["Item", item.id]]
    expect(response.parsed_body["data"].map { |r| [r["type"], r["id"]] }).to eq(expected)
  end

  it "treats LIKE wildcards in the query literally" do
    create(:item, name: "Rope")

    get api_v1_game_mentions_path(game), headers: @auth_headers, params: { kind: "things", q: "%" }

    expect(response.parsed_body["data"]).to be_empty
  end

  it "returns 404 outside the user's games" do
    get api_v1_game_mentions_path(create(:game)), headers: @auth_headers, params: { kind: "people", q: "" }

    expect(response).to have_http_status(:not_found)
  end
end
