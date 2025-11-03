require "rails_helper"

RSpec.describe User do
  context "validations" do
    it { is_expected.to validate_presence_of :email }
  end

  context "relationships" do
    it { is_expected.to have_many :characters }
    it { is_expected.to have_many(:games).through(:user_games) }
  end

  context "game methods" do
    describe "#in_game?" do
      let(:user) { create(:user) }
      let(:game) { create(:game) }

      it "is true if a user is active in a game" do
        create(:user_game, user:, game:)

        expect(user.in_game?(game.id)).to be true
      end

      it "is false if a user is inactive in a game" do
        create(:user_game, user:, game:, status: :dropped)

        expect(user.in_game?(game.id)).to be false
      end

      it "is false if a user is not in a game" do
        other_user = create(:user)
        create(:user_game, user: other_user, game:)

        expect(user.in_game?(game.id)).to be false
      end
    end

    describe "#is_game_admin?" do
      let(:user) { create(:user) }
      let(:game) { create(:game) }

      it "is true if a user has admin role for the game" do
        create(:user_game, user:, game:, role: :admin)

        expect(user.is_game_admin?(game.id)).to be true
      end

      it "is true if a user has dm role for the game" do
        create(:user_game, user:, game:, role: :dm)

        expect(user.is_game_admin?(game.id)).to be true
      end

      it "is false if a user is a player in the game" do
        create(:user_game, user:, game:, role: :player)

        expect(user.is_game_admin?(game.id)).to be false
      end

      it "is false if a user is inactive in a game" do
        create(:user_game, user:, game:, role: :admin, status: :dropped)

        expect(user.is_game_admin?(game.id)).to be false
      end

      it "is false if a user is not in a game" do
        other_user = create(:user)
        create(:user_game, user: other_user, game:)

        expect(user.in_game?(game.id)).to be false
      end
    end
  end
end
