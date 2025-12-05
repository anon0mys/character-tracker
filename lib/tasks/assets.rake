# Ensure CSS and JS are built before assets:precompile
# This is needed for cssbundling-rails and jsbundling-rails to work correctly on Heroku
namespace :assets do
  task :build_css do
    unless system("yarn build:css")
      raise "Failed to build CSS assets"
    end
  end

  task :build_js do
    unless system("yarn build")
      raise "Failed to build JavaScript assets"
    end
  end
end

# Ensure CSS and JS builds run before assets:precompile
Rake::Task["assets:precompile"].enhance(["assets:build_js", "assets:build_css"])

