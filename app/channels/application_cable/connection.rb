module ApplicationCable
  # Browsers can't set headers on a websocket, so the JWT rides as ?token=.
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = AuthToken.user_for(request.params[:token]) || reject_unauthorized_connection
    end
  end
end
