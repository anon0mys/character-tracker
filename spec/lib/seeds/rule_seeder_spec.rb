require "rails_helper"
require Rails.root.join("lib/seeds/rule_seeder")

describe Seeds::RuleSeeder do
  it "loads the SRD rules file and is safe to run again" do
    create(:rule, slug: "gone-from-the-file")

    count = described_class.call
    expect(count).to be > 100
    expect { described_class.call }.not_to change(Rule, :count)
    expect(Rule.find_by(slug: "cover").body).to include("three-quarters cover")
    expect(Rule.exists?(slug: "gone-from-the-file")).to be(false)
  end
end
