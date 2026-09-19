class UserSerializer < Blueprinter::Base
  identifier :id

  fields :id, :email, :current_character_id

  field :current_character do |user, _options|
    next nil unless user.current_character

    {
      id: user.current_character.id,
      name: user.current_character.name,
      archetype: user.current_character.archetype.name.to_s.capitalize,
      level: user.current_character.level,
    }
  end
end
