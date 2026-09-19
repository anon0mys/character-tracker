require "rails_helper"

describe "POST /api/v1/characters/:id/rest" do
  let(:user) { create(:user) }
  let(:character) do
    create(:character,
      user:, level: 8, constitution: 14,
      current_hitpoints: 5, temp_hitpoints: 3,
      max_hitpoints_bonus: 10, hit_dice_remaining: 1,
      spell_slots_used: { "1" => 2 }, exhaustion: 1)
  end

  before { sign_in(user) }

  context "with type=long" do
    before do
      post api_v1_character_rest_path(character), headers: @auth_headers, params: { type: "long" }
    end

    it "returns 200" do
      expect(response).to have_http_status(:success)
    end

    it "resets HP, temp HP, bonus, slots, exhaustion" do
      character.reload
      expect(character.temp_hitpoints).to eq 0
      expect(character.max_hitpoints_bonus).to eq 0
      expect(character.current_hitpoints).to eq character.max_hitpoints
      expect(character.spell_slots_used).to eq({})
      expect(character.exhaustion).to eq 0
      expect(character.hit_dice_remaining).to eq 5  # 1 + floor(8/2)
    end
  end

  context "with type=short" do
    before do
      create(:character_tracker, character:, reset_on: "short_rest", max_uses: 3, current_uses: 3)
      post api_v1_character_rest_path(character), headers: @auth_headers, params: { type: "short" }
    end

    it "returns 200 and resets short-rest trackers" do
      expect(response).to have_http_status(:success)
      expect(character.character_trackers.first.reload.current_uses).to eq 0
    end
  end

  context "with invalid type" do
    it "responds 422" do
      post api_v1_character_rest_path(character), headers: @auth_headers, params: { type: "bogus" }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
