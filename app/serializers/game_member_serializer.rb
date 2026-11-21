# A membership in a campaign as the members list shows it. Pass current_user
# (marks "you") and characters (user_id => character names in the campaign).
class GameMemberSerializer < Blueprinter::Base
  identifier :id

  fields :user_id, :role

  field(:name) { |member| member.user.display_name }
  field(:you) { |member, options| member.user_id == options[:current_user]&.id }
  field(:characters) { |member, options| options.fetch(:characters, {}).fetch(member.user_id, []) }
end
