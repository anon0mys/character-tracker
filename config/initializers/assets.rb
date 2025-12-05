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
# The most reliable way is to unregister the SCSS processor multiple times at different points
Rails.application.config.assets.configure do |env|
  if defined?(Sprockets::ScssProcessor)
    begin
      env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
    rescue => e
      # Ignore
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

# Completely prevent Sass from processing CSS files
# We do this by removing the SCSS processor and ensuring CSS files are not processed
Rails.application.config.assets.configure do |env|
  # Remove all SCSS processors for CSS files
  if defined?(Sprockets::ScssProcessor)
    begin
      # Unregister the processor
      env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
    rescue => e
      # Ignore if already unregistered
    end
  end
  
  # Also remove any Sass processors
  if defined?(Sass::Rails::ScssTemplate)
    begin
      env.unregister_preprocessor('text/css', Sass::Rails::ScssTemplate)
    rescue => e
      # Ignore if not registered
    end
  end
end

# Ensure this happens after all gems load
Rails.application.config.after_initialize do
  Rails.application.config.assets.configure do |env|
    # Final attempt to remove SCSS processor
    if defined?(Sprockets::ScssProcessor)
      processors = env.preprocessors['text/css']
      if processors
        processors.each do |processor|
          if processor.is_a?(Sprockets::ScssProcessor) || 
             (processor.respond_to?(:name) && processor.name.to_s.include?('Scss'))
            begin
              env.unregister_preprocessor('text/css', processor)
            rescue => e
              # Ignore errors
            end
          end
        end
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

