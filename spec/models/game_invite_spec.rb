require "rails_helper"

RSpec.describe GameInvite do
  let(:game) { create(:game) }
  let(:dm) { create(:user) }

  def invite(**)
    described_class.create!(game:, created_by: dm, **)
  end

  it "gets a token and a two-week expiry; a DM link works once" do
    player_link = invite
    dm_link = invite(role: "dm")

    expect(player_link.token.length).to be >= 20
    expect(player_link.expires_at).to be_within(1.minute).of(14.days.from_now)
    expect([player_link.max_uses, dm_link.max_uses]).to eq([nil, 1])
  end

  it "only allows player and dm links" do
    expect { invite(role: "admin") }.to raise_error(ActiveRecord::RecordInvalid)
  end

  describe "#accept!" do
    it "adds the user with the link's role and counts the use" do
      link = invite(role: "dm")
      newcomer = create(:user)

      membership = link.accept!(newcomer)

      expect(membership).to have_attributes(user: newcomer, game:, role: "dm", status: "active")
      expect(link.reload.uses_count).to eq(1)
    end

    it "keeps a member's role, except a DM link makes a player the DM" do
      player = create(:user_game, game:, role: :player).user
      admin = create(:user_game, game:, role: :admin).user

      invite.accept!(player)
      expect(game.user_games.find_by(user: player).role).to eq("player")

      invite(role: "dm").accept!(player)
      invite(role: "dm").accept!(admin)
      expect(game.user_games.find_by(user: player).role).to eq("dm")
      expect(game.user_games.find_by(user: admin).role).to eq("admin")
    end

    it "brings back someone who had dropped out" do
      dropped = create(:user_game, game:, status: :dropped)

      invite.accept!(dropped.user)

      expect(dropped.reload.status).to eq("active")
    end

    it "refuses once revoked, expired or used up" do
      revoked = invite.tap(&:revoke!)
      expired = invite.tap { |link| link.update!(expires_at: 1.minute.ago) }
      used = invite(role: "dm").tap { |link| link.accept!(create(:user)) }

      [revoked, expired, used].each do |link|
        expect { link.accept!(create(:user)) }.to raise_error(GameInvite::Unusable)
      end
      expect(described_class.usable).to be_empty
    end
  end
end
