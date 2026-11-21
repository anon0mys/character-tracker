require "rails_helper"

describe "/api/v1/games/:game_id/members" do
  let(:game) { create(:game) }
  let(:admin) { create(:user, username: "Evan") }
  let(:player) { create(:user, email: "rist@example.com") }
  let!(:admin_membership) { create(:user_game, game:, user: admin, role: :admin) }
  let!(:player_membership) { create(:user_game, game:, user: player, role: :player) }

  describe "GET index" do
    it "lists the members with their roles and characters" do
      create(:character, game:, user: player, name: "Rist")
      sign_in(player)

      get api_v1_game_members_path(game), headers: @auth_headers

      rows = response.parsed_body["data"].map { |m| m.slice("name", "role", "you", "characters") }
      expect(rows).to eq(
        [
          { "name" => "Evan", "role" => "admin", "you" => false, "characters" => [] },
          { "name" => "rist", "role" => "player", "you" => true, "characters" => ["Rist"] },
        ],
      )
    end

    it "is not found for someone outside the campaign" do
      sign_in(create(:user))

      get api_v1_game_members_path(game), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "PATCH update" do
    it "lets an admin make a player the DM" do
      sign_in(admin)

      patch api_v1_game_member_path(game, player_membership), headers: @auth_headers,
        params: { member: { role: "dm" } }

      expect(response).to have_http_status(:ok)
      expect(player_membership.reload.role).to eq("dm")
    end

    it "is forbidden to players" do
      sign_in(player)

      patch api_v1_game_member_path(game, player_membership), headers: @auth_headers,
        params: { member: { role: "dm" } }

      expect(response).to have_http_status(:forbidden)
      expect(player_membership.reload.role).to eq("player")
    end

    it "won't demote the last admin or DM" do
      sign_in(admin)

      patch api_v1_game_member_path(game, admin_membership), headers: @auth_headers,
        params: { member: { role: "player" } }

      expect(response).to have_http_status(:forbidden)
      expect(admin_membership.reload.role).to eq("admin")
    end
  end

  describe "DELETE destroy" do
    it "lets an admin remove a player, who then loses access" do
      sign_in(admin)

      delete api_v1_game_member_path(game, player_membership), headers: @auth_headers

      expect(response).to have_http_status(:accepted)
      expect(player.reload.games).to be_empty
    end

    it "lets a player leave but not remove others" do
      sign_in(player)

      delete api_v1_game_member_path(game, admin_membership), headers: @auth_headers
      expect(response).to have_http_status(:forbidden)

      delete api_v1_game_member_path(game, player_membership), headers: @auth_headers
      expect(response).to have_http_status(:accepted)
    end

    it "won't let the last admin or DM leave" do
      sign_in(admin)

      delete api_v1_game_member_path(game, admin_membership), headers: @auth_headers

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body["errors"]).to eq(["Make someone else an admin or DM first"])
    end
  end
end
