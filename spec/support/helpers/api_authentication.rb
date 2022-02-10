module Helpers
  module ApiAuthentication
    def sign_in(user)
      @auth_headers = {'Authentication': "Bearer #{user.generate_jwt}"}
    end
  end
end