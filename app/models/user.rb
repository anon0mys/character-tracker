class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :characters
  has_many :user_games
  has_many :games, through: :user_games

  def generate_jwt
    JWT.encode(
      {id: id, exp: 30.days.from_now.to_i},
      Rails.application.credentials.secret_key_base
    )
  end

  def in_game?(game_id)
    user_games.where(game_id: game_id, status: :active).exists?
  end

  def is_game_admin?(game_id)
    game = user_games.find_by(game_id: game_id, status: :active)
    return false if not game
    game.admin? || game.dm?
  end
end
