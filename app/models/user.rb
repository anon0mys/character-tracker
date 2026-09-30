class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  has_many :characters
  has_many :user_games
  has_many :games, through: :user_games
  belongs_to :current_character, class_name: "Character", optional: true

  validate :current_character_belongs_to_user, if: -> { current_character_id.present? }

  def current_character_belongs_to_user
    return unless current_character && current_character.user_id != id

    errors.add(:current_character_id, "must belong to this user")
  end

  def generate_jwt
    JWT.encode(
      { id:, exp: 30.days.from_now.to_i },
      Rails.application.credentials.secret_key_base,
    )
  end

  def in_game?(game_id)
    user_games.exists?(game_id:, status: :active)
  end

  def game_admin?(game_id)
    game = user_games.find_by(game_id:, status: :active)
    return false unless game

    game.admin? || game.dm?
  end

  alias is_game_admin? game_admin?
end
