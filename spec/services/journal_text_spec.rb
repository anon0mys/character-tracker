require "rails_helper"

RSpec.describe JournalText do
  it "gives one line per paragraph, heading and list item, with chips as their labels" do
    body = {
      "type" => "doc",
      "content" => [
        { "type" => "heading", "attrs" => { "level" => 3 }, "content" => [{ "type" => "text", "text" => "Loot" }] },
        { "type" => "bulletList", "content" => [
          { "type" => "listItem", "content" => [
            { "type" => "paragraph", "content" => [
              { "type" => "personMention", "attrs" => { "id" => 1, "type" => "Npc", "label" => "Bothane" } },
              { "type" => "text", "text" => " takes the halberd" },
            ] },
            { "type" => "bulletList", "content" => [
              { "type" => "listItem", "content" => [
                { "type" => "paragraph", "content" => [{ "type" => "text", "text" => "drains sanity" }] },
              ] },
            ] },
          ] },
        ] },
        { "type" => "paragraph" },
      ],
    }

    expect(described_class.call(body)).to eq("Loot\nBothane takes the halberd\ndrains sanity")
  end

  it "is empty for an empty or missing body" do
    expect(described_class.call({})).to eq("")
    expect(described_class.call(nil)).to eq("")
  end
end
