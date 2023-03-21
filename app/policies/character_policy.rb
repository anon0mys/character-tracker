class CharacterPolicy < ApplicationPolicy
  def join_game?
    user.in_game?(record.game_id)
  end
end