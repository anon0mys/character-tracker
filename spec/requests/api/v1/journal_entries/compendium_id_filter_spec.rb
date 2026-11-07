require "rails_helper"

# Journal chips deep-link into the Compendium by id.
describe "Compendium ?id= filter" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  {
    item: :api_v1_items_path,
    spell: :api_v1_spells_path,
    monster: :api_v1_monsters_path,
  }.each do |factory, path|
    it "returns only the #{factory} with that id" do
      wanted = create(factory)
      create(factory)

      get public_send(path), headers: @auth_headers, params: { id: wanted.id }

      expect(response.parsed_body["data"].pluck("id")).to eq([wanted.id])
    end
  end
end
