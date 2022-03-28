module Helpers
  module ApiAuthentication
    def sign_in(user)
      @auth_headers = {'HTTP_AUTHORIZATION': "Bearer #{user.generate_jwt}"}
    end
  end
end