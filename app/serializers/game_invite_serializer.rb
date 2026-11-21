# An invite link as its campaign's admins see it. The client builds the
# shareable URL from the token (/join/:token).
class GameInviteSerializer < Blueprinter::Base
  identifier :id

  fields :token, :role, :max_uses, :uses_count, :expires_at

  field(:created_by) { |invite| invite.created_by.display_name }
end
