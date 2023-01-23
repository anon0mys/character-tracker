require 'rails_helper'

RSpec.describe Item, type: :model do
  context 'validations' do
    context 'enums' do
      it do
        should define_enum_for(:status)
          .with_values(combine_to_hash(Item::STATUSES))
          .backed_by_column_of_type(:string)
      end

      it do
        should define_enum_for(:item_type)
          .with_values(combine_to_hash(Item::ITEM_TYPES))
          .backed_by_column_of_type(:string)
      end
    end
  end

  context 'relationships' do
    it { should have_many(:characters).through(:character_items) }
  end
end