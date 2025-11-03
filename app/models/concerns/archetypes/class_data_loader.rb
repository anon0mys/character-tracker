module Archetypes
  module ClassDataLoader
    def self.load
      @load ||= begin
        file_path = Rails.root.join("lib/seeds/class_data.json")
        JSON.parse(File.read(file_path)).index_by { |data| data["name"].downcase.to_sym }
      end
    end

    def self.for_class(class_name)
      load[class_name.to_sym]
    end
  end
end
