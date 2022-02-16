module Filterable
  extend ActiveSupport::Concern

  module ClassMethods
    def filter(filtering_params)
      results = self.where(nil)
      filtering_params.each do |name, value|
        results = results.public_send("#{name}_eq", value) if value.present?
      end
      results
    end
  end
end