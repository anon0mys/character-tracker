module Extractors
  class AbilityDataExtractor < Blueprinter::Extractor
    def extract(field_name, object, _local_options, _options = {})
      {
        value: object.value_of(field_name),
        modifier: object.modifier_for(field_name),
        save: object.save_for(field_name),
      }
    end
  end
end
