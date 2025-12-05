require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CharacterTracker
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    config.eager_load_paths << Rails.root.join("lib")
    config.autoload_paths << Rails.root.join("app/services")

    # Don't generate system test files.
    config.generators.system_tests = nil
    
    # Prevent sass-rails from processing CSS files
    # This must be done early, before sass-rails registers itself
    config.assets.configure do |env|
      if defined?(Sprockets::ScssProcessor)
        begin
          env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
        rescue => e
          # Ignore if not registered yet
        end
      end
    end
  end
end
