require "rails_helper"

describe "Schema::Query#spells" do
  before { create_list(:spell, 5) }

  it "returns a list of spells" do
    user_query = "
    query Spells {
      spells {
        name
        description
        archetypes
        level
        school
        castingTime
        range
        duration
        components
      }
    }
    "
    post graphql_path, params: { query: user_query }
    result = JSON.parse(response.body)
    spells = result["data"]["spells"]

    expect(spells.length).to eq 5
  end
end
