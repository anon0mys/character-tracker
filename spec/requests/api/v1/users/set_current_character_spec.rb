require "rails_helper"

describe "PATCH /api/v1/users/current_character" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  it "sets current character" do
    patch "/api/v1/users/current_character", headers: @auth_headers, params: { character_id: character.id }
    expect(response).to have_http_status(:success)
    body = response.parsed_body["data"]
    expect(body["current_character_id"]).to eq character.id
    expect(body["current_character"]["name"]).to eq character.name
    expect(user.reload.current_character_id).to eq character.id
  end

  it "clears current character with null" do
    user.update!(current_character: character)
    patch "/api/v1/users/current_character", headers: @auth_headers, params: { character_id: nil }
    expect(response).to have_http_status(:success)
    expect(user.reload.current_character_id).to be_nil
  end

  it "returns 404 if character not owned by user" do
    other = create(:user)
    other_char = create(:character, user: other)
    patch "/api/v1/users/current_character", headers: @auth_headers, params: { character_id: other_char.id }
    expect(response).to have_http_status(:not_found)
  end
end
