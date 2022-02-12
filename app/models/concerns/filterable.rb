module Filterable
  extend ActiveSupport::Concern

  module ClassMethods
    def filter(filtering_params)
      results = self.where(nil)
      filtering_params.each do |name, value|
        results = results.public_send("filter_by_#{name}", value) if value.present?
      end
      results
    end
  end
end