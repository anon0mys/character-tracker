require "rails_helper"

describe "GET /api/v1/items" do
  let(:user) { create(:user) }

  before do
    create_list(:item, 49)
    create(:item, name: "Item of Search")
  end

  context "as an authenticated user" do
    before { sign_in(user) }

    context "with no filter" do
      it "returns a paginated list of items" do
        get api_v1_items_path, headers: @auth_headers
        result = response.parsed_body
        items = Item.limit(20)
        expect(result["data"].count).to eq 20
        expect(result["data"][0]["id"]).to eq items.first.id
        expect(result["data"][-1]["id"]).to eq items.last.id
      end

      it "is able to return the next page" do
        get "#{api_v1_items_path}?page=2", headers: @auth_headers
        result = response.parsed_body
        items = Item.offset(20).limit(20)
        expect(result["data"].count).to eq 20
        expect(result["data"][0]["id"]).to eq items.first.id
        expect(result["data"][-1]["id"]).to eq items.last.id
      end

      it "returns pagination metadata" do
        get api_v1_items_path, headers: @auth_headers
        result = response.parsed_body
        expect(result["page"]).to eq 1
        expect(result["prev"]).to be_nil
        expect(result["next"]).to eq 2
        expect(result["pages"]).to eq 3
      end
    end

    context "with filters" do
      it "filters by name" do
        get "#{api_v1_items_path}?name=search", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Item.where("name ILIKE ?", "%search%").count
      end

      it "filters by homebrew" do
        create(:item, name: "Wynmaw", homebrew: true, source: "Race Wars", tags: ["magic item"])
        get "#{api_v1_items_path}?homebrew=true", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].pluck("name")).to eq ["Wynmaw"]
        expect(result["data"].first).to include("source" => "Race Wars", "tags" => ["magic item"])
      end

      it "filters by tag" do
        create(:item, name: "Wynmaw", tags: ["magic item"])
        get "#{api_v1_items_path}?tag=magic%20item", headers: @auth_headers
        expect(response.parsed_body["data"].pluck("name")).to eq ["Wynmaw"]
      end

      it "filters by quality" do
        get "#{api_v1_items_path}?quality=common", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq [Item.where(quality: "common").count, 20].min
      end

      it "filters by item_type" do
        get "#{api_v1_items_path}?item_type=armor", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq [Item.where(item_type: "armor").count, 20].min
      end

      it "is able to combine filters" do
        create(:item, homebrew: true, quality: "legendary", item_type: "weapon")
        get(
          "#{api_v1_items_path}?homebrew=true&quality=legendary&item_type=weapon",
          headers: @auth_headers,
        )
        result = response.parsed_body
        expect(result["data"].count).to eq Item
          .where(homebrew: true, quality: "legendary", item_type: "weapon")
          .count
      end
    end
  end
end
