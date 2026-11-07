require "rails_helper"

describe "/api/v1/games/:game_id/holdings" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:baal) { create(:character, game:, name: "Ba'al", user: create(:user)) }
  let(:pov) { create(:character, game:, name: "Pov") }
  let(:boots) { create(:item, name: "Boots of Elvenkind", description: "Your steps make no sound.") }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  describe "GET index" do
    it "lists the campaign's holdings with holder and item, without descriptions" do
      create(:holding, game:, item: boots, holder: baal, status: "equipped", notes: "Silent feet")
      create(:holding, game: create(:game), item: boots)

      get api_v1_game_holdings_path(game), headers: @auth_headers

      data = response.parsed_body["data"]
      expect(data.size).to eq(1)
      expect(data.first).to include(
        "holder_type" => "Character", "holder_name" => "Ba'al", "status" => "equipped", "notes" => "Silent feet",
      )
      expect(data.first["item"]).to include("name" => "Boots of Elvenkind")
      expect(data.first).not_to have_key("description")
    end

    it "filters by item" do
      create(:holding, game:, item: boots)
      create(:holding, game:)

      get api_v1_game_holdings_path(game), headers: @auth_headers, params: { item_id: boots.id }

      expect(response.parsed_body["data"].pluck("item_id")).to eq([boots.id])
    end

    it "is closed to people outside the campaign" do
      get api_v1_game_holdings_path(create(:game)), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "GET show" do
    it "adds the item's description" do
      holding = create(:holding, game:, item: boots)

      get api_v1_game_holding_path(game, holding), headers: @auth_headers

      expect(response.parsed_body["data"]["description"]).to eq("Your steps make no sound.")
    end
  end

  describe "POST create" do
    it "gives an item to a holder" do
      post api_v1_game_holdings_path(game), headers: @auth_headers,
        params: { holding: { item_id: boots.id }, holder_type: "Character", holder_id: pov.id }

      expect(response).to have_http_status(:created)
      expect(pov.holdings.map(&:item)).to eq([boots])
    end

    it "files it as not placed without a holder" do
      post api_v1_game_holdings_path(game), headers: @auth_headers, params: { holding: { item_id: boots.id } }

      expect(game.holdings.map(&:holder)).to eq([nil])
    end

    it "refuses an unknown holder type" do
      post api_v1_game_holdings_path(game), headers: @auth_headers,
        params: { holding: { item_id: boots.id }, holder_type: "User", holder_id: user.id }

      expect(response).to have_http_status(:not_found)
      expect(game.holdings).to be_empty
    end
  end

  describe "PATCH update" do
    let(:pile) { create(:holding, game:, item: boots, holder: baal, quantity: 3) }

    it "changes status, quantity and notes" do
      patch api_v1_game_holding_path(game, pile), headers: @auth_headers,
        params: { holding: { status: "sold", quantity: 2, notes: "To Ashawn" } }

      expect(pile.reload).to have_attributes(status: "sold", quantity: 2, notes: "To Ashawn")
    end

    it "moves part of a pile to another character" do
      patch api_v1_game_holding_path(game, pile), headers: @auth_headers,
        params: { holder_type: "Character", holder_id: pov.id, move_quantity: 1 }

      expect(response).to have_http_status(:ok)
      expect(pile.reload.quantity).to eq(2)
      expect(pov.holdings.pluck(:quantity)).to eq([1])
    end

    it "will not move into another campaign" do
      outsider = create(:character, game: create(:game))

      patch api_v1_game_holding_path(game, pile), headers: @auth_headers,
        params: { holder_type: "Character", holder_id: outsider.id }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(pile.reload.holder).to eq(baal)
    end
  end

  describe "DELETE destroy" do
    it "removes the holding" do
      holding = create(:holding, game:)

      delete api_v1_game_holding_path(game, holding), headers: @auth_headers

      expect(Holding.exists?(holding.id)).to be false
    end
  end
end
