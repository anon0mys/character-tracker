require "rails_helper"

describe "Schema::Query#spell_search" do
  before { create_list(:spell, 50) }

  let(:spell_query) do
    <<~GRAPHQL
      query SpellSearch($search: SpellSearchInput!) {
        spellSearch(search: $search) {
          name
        }
      }
    GRAPHQL
  end

  context "by name" do
    let(:variables) do
      {
        search: {
          name: "thunder",
        },
      }
    end

    it "returns a list of spells that fuzzy match the search word" do
      create(:spell, name: "Thunderwave")
      create(:spell, name: "Thunderclap")
      create(:spell, name: "Lightning and thunder")

      post graphql_path, params: {
        query: spell_query,
        variables:,
      }
      result = JSON.parse(response.body)
      spells = result["data"]["spellSearch"]

      expect(spells.length).to eq 3
    end
  end

  context "by archetype" do
    it "returns a list of spells that match a single archetype" do
      post graphql_path, params: {
        query: spell_query,
        variables: {
          search: {
            archetype: ["wizard"],
          },
        },
      }
      result = JSON.parse(response.body)
      spells = result["data"]["spellSearch"]

      expect(spells.length).to eq Spell.where("archetypes && '{wizard}'").count
    end

    it "returns a list of spells that match multiple archetypes" do
      post graphql_path, params: {
        query: spell_query,
        variables: {
          search: {
            archetype: %w[bard wizard],
          },
        },
      }
      result = JSON.parse(response.body)
      spells = result["data"]["spellSearch"]

      expect(spells.length).to eq Spell.where("archetypes && '{bard,wizard}'").count
    end
  end

  context "by level" do
    it "returns a list of spells that match a single level" do
      post graphql_path, params: {
        query: spell_query,
        variables: {
          search: {
            level: ["cantrip"],
          },
        },
      }
      result = JSON.parse(response.body)
      spells = result["data"]["spellSearch"]

      expect(spells.length).to eq Spell.where(level: ["cantrip"]).count
    end

    it "returns a list of spells that match multiple levels" do
      post graphql_path, params: {
        query: spell_query,
        variables: {
          search: {
            level: %w[cantrip 1],
          },
        },
      }
      result = JSON.parse(response.body)
      spells = result["data"]["spellSearch"]

      expect(spells.length).to eq Spell.where(level: %w[cantrip 1]).count
    end
  end
end
