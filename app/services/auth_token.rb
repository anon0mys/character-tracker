# Resolves the user a JWT (from User#generate_jwt) belongs to. Shared by the
# API's Authorization header and the Action Cable connection's token param.
class AuthToken
  def self.user_for(token)
    return if token.blank?

    payload = JWT.decode(token, Rails.application.credentials.secret_key_base).first
    User.find_by(id: payload["id"])
  rescue JWT::ExpiredSignature => e
    Rails.logger.error "JWT ExpiredSignature: #{e.message}"
    nil
  rescue JWT::VerificationError => e
    Rails.logger.error "JWT VerificationError: #{e.message}"
    nil
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT DecodeError: #{e.message} - Token: #{token[0..20]}..."
    nil
  rescue StandardError => e
    Rails.logger.error "Unexpected error parsing auth token: #{e.class} - #{e.message}"
    nil
  end
end
