class Extractors::AbilityDataExtractor < Blueprinter::Extractor
  def extract(_field_name, _object, _local_options, _options={})
    {
      value: _object.value_of(_field_name),
      modifier: _object.modifier_for(_field_name),
      save: _object.save_for(_field_name),
    }
  end
end
