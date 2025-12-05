# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add builds directory to asset paths so application.js can be found
Rails.application.config.assets.paths << Rails.root.join('app', 'assets', 'builds')

# Prevent sass-rails from processing CSS files
# Files compiled by PostCSS/Tailwind contain modern CSS syntax (like hsl(var(--border)))
# that SassC cannot parse. Since we use cssbundling-rails for CSS, we only want SCSS processing for .scss files.
Rails.application.config.assets.configure do |env|
  # Unregister SCSS processor for CSS files to prevent Sass from processing PostCSS-compiled CSS
  # sass-rails automatically registers itself for text/css, but we only want it for .scss files
  if defined?(Sprockets::ScssProcessor)
    begin
      env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
    rescue => e
      Rails.logger.warn("Could not unregister SCSS processor: #{e.message}")
    end
  end
end

# Also unregister after initialization to ensure it takes effect
# This runs after all gems have loaded and registered their processors
Rails.application.config.after_initialize do
  Rails.application.config.assets.configure do |env|
    if defined?(Sprockets::ScssProcessor)
      begin
        env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
      rescue => e
        # Silently fail if already unregistered
      end
    end
  end
end

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Note: CSS files from builds/ are compiled by PostCSS via cssbundling-rails
# They're served directly, not through the asset pipeline, so we exclude them
Rails.application.config.assets.precompile += %w( admin.js admin.css )

