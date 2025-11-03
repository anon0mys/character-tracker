# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Prevent sass-rails from processing CSS files
# - Files in app/assets/builds/ are already compiled by PostCSS/Tailwind
#   and contain modern CSS syntax (like hsl(var(--border))) that SassC cannot parse
# - Files like application.postcss.css should be processed by PostCSS, not Rails asset pipeline
# - Only .scss files (like active_admin.scss) should be processed by sass-rails
Rails.application.config.assets.configure do |env|
  # Unregister SCSS processor for .css files globally
  # This prevents SassC from trying to parse modern CSS syntax in compiled files
  # and prevents Rails from processing .postcss.css files
  if env.respond_to?(:unregister_bundle_processor)
    env.unregister_bundle_processor('text/css', Sprockets::ScssProcessor) if defined?(Sprockets::ScssProcessor)
  end
end

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )
