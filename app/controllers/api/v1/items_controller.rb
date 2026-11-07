module Api
  module V1
    class ItemsController < ApiController
      before_action :authenticate_user!

      def index
        response = paginate(Item.filter(filtering_params))
        render json: response
      end

      def show; end

      def create
        @item = Item.create!(item_params)
        render json: { data: @item }
      end

      def update
        @item = Item.find(params[:id])
        if @item.update(item_params)
          render json: { data: @item }
        else
          render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def item_params
        params.require(:item).permit(
          :name,
          :description,
          :item_type,
          :quality,
          :potential_damage,
          :total_charges,
          :value,
          :requires_attunement,
          :ac,
          :stat_bonuses,
          :source,
          :homebrew,
          tags: [],
        )
      end

      def filtering_params
        params.slice(:id, :quality, :item_type, :name, :homebrew, :tag)
      end
    end
  end
end
