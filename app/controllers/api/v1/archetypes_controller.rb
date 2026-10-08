module Api
  module V1
    class ArchetypesController < ApiController
      before_action :authenticate_user!

      def index
        data = Archetype.order(:name).map do |archetype|
          {
            name: archetype.name,
            subclass_label: archetype.subclass_label,
            subclasses: archetype.subclasses.order(:name).pluck(:name),
          }
        end
        render json: { data: }
      end
    end
  end
end
