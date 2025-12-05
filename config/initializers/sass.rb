# Configure sass-rails to only process .scss files, not .css files
# This prevents Sass from processing PostCSS-compiled CSS files
# We do this by registering a processor that runs before Sass and skips .css files
Rails.application.config.assets.configure do |env|
  # Create a processor that only processes .scss files, not .css files
  scss_only_processor = Class.new do
    def self.call(input)
      filename = input[:filename] || input[:load_path] || ''
      # Only process .scss files, skip .css files
      if filename.to_s.end_with?('.scss')
        # Let Sass process it
        input
      elsif filename.to_s.end_with?('.css')
        # Skip CSS files - return unchanged
        { data: input[:data] }
      else
        input
      end
    end
  end
  
  # Register this processor to run before Sass
  begin
    env.register_preprocessor('text/css', scss_only_processor, silence_deprecation: true)
  rescue => e
    Rails.logger.warn("Could not register SCSS-only processor: #{e.message}")
  end
  
  # Also unregister SCSS processor for CSS files
  if defined?(Sprockets::ScssProcessor)
    begin
      env.unregister_preprocessor('text/css', Sprockets::ScssProcessor)
    rescue => e
      # Ignore if not registered yet
    end
  end
end

