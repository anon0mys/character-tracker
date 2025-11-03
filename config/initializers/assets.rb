# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Prevent sass-rails from processing CSS files
# Files compiled by PostCSS/Tailwind contain modern CSS syntax (like hsl(var(--border)))
# that SassC cannot parse. Since we use cssbundling-rails for CSS, we only want SCSS processing for .scss files.
Rails.application.config.assets.configure do |env|
  # Unregister SCSS processor for CSS files
  # sass-rails automatically registers itself for text/css, but we only want it for .scss files
  if defined?(Sprockets::ScssProcessor)
    begin
      # Try to unregister the SCSS processor
      # This prevents it from processing .css files while still allowing .scss files to work
      env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
    rescue => e
      # If unregister doesn't work, try accessing internal registry
      begin
        # Get processors registry
        processors_by_type = env.instance_variable_get(:@processors) || {}
        css_processors = processors_by_type['text/css'] || []
        
        # Filter out SCSS processors
        non_scss_processors = css_processors.reject do |processor|
          processor.is_a?(Sprockets::ScssProcessor) || 
          processor.to_s.include?('ScssProcessor')
        end
        
        # Clear and re-register
        env.unregister_preprocessor('text/css', /.*/) rescue nil
        non_scss_processors.each { |p| env.register_preprocessor('text/css', p) }
      rescue => e2
        Rails.logger.warn("Could not prevent SCSS processing of CSS: #{e.message}, #{e2.message}")
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
