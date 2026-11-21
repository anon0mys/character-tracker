require "rails_helper"

describe "Campaign invites" do
  let(:game) { create(:game, name: "Race Wars") }
  let(:admin) { create(:user, username: "Evan") }
  let(:player) { create(:user) }

  before do
    create(:user_game, game:, user: admin, role: :admin)
    create(:user_game, game:, user: player, role: :player)
  end

  describe "/api/v1/games/:game_id/invites" do
    it "lets an admin make player and DM links and list the usable ones" do
      sign_in(admin)

      post api_v1_game_invites_path(game), headers: @auth_headers
      post api_v1_game_invites_path(game), headers: @auth_headers, params: { invite: { role: "dm" } }
      game.game_invites.create!(created_by: admin).revoke!

      get api_v1_game_invites_path(game), headers: @auth_headers

      data = response.parsed_body["data"]
      expect(data.pluck("role")).to contain_exactly("player", "dm")
      expect(data.find { |i| i["role"] == "dm" }).to include("max_uses" => 1, "created_by" => "Evan")
      expect(data.first["token"]).to be_present
    end

    it "lets an admin revoke a link" do
      invite = game.game_invites.create!(created_by: admin)
      sign_in(admin)

      delete api_v1_game_invite_path(game, invite), headers: @auth_headers

      expect(response).to have_http_status(:accepted)
      expect(invite.reload.usable?).to be(false)
    end

    it "is forbidden to players" do
      sign_in(player)

      post api_v1_game_invites_path(game), headers: @auth_headers

      expect(response).to have_http_status(:forbidden)
      expect(game.game_invites).to be_empty
    end
  end

  describe "/api/v1/invites/:token" do
    let(:invite) { game.game_invites.create!(created_by: admin, role: "dm") }
    let(:newcomer) { create(:user) }

    it "shows what the link is for" do
      sign_in(newcomer)

      get api_v1_invite_path(invite.token), headers: @auth_headers

      expect(response.parsed_body["data"]).to eq(
        "game_id" => game.id, "game_name" => "Race Wars", "role" => "dm",
        "invited_by" => "Evan", "usable" => true, "member_role" => nil
      )
    end

    it "joins the campaign with the link's role" do
      sign_in(newcomer)

      post accept_api_v1_invite_path(invite.token), headers: @auth_headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["data"]["member_role"]).to eq("dm")
      expect(newcomer.reload.games).to eq([game])
    end

    it "is gone once used up" do
      invite.accept!(create(:user))
      sign_in(newcomer)

      post accept_api_v1_invite_path(invite.token), headers: @auth_headers

      expect(response).to have_http_status(:gone)
      expect(newcomer.reload.games).to be_empty
    end

    it "is not found for an unknown token" do
      sign_in(newcomer)

      get api_v1_invite_path("nope"), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
