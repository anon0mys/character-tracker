# Ensure CSS and JS are built before assets:precompile
# This is needed for cssbundling-rails and jsbundling-rails to work correctly on Heroku
namespace :assets do
  task build_css: :environment do
    raise "Failed to build CSS assets" unless system("yarn build:css")
  end

  task build_js: :environment do
    raise "Failed to build JavaScript assets" unless system("yarn build")
  end
end

# Ensure CSS and JS builds run before assets:precompile
Rake::Task["assets:precompile"].enhance(["assets:build_js", "assets:build_css"])
