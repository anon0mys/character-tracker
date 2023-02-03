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

  context 'scopes' do
    it 'should filter by name' do
      create(:item, name: 'Bag')
      create(:item, name: 'Bigger Bag')
      create(:item, name: 'Sword')

      expect(Item.name_eq('sword').count).to eq 1
      expect(Item.name_eq('bag').count).to eq 2
    end

    it 'should filter by status' do
      create(:item, status: 'sold')
      create(:item, status: 'stored')
      create(:item, status: 'stored')

      expect(Item.status_eq('stored').count).to eq 2
      expect(Item.status_eq('sold').count).to eq 1
      expect(Item.status_eq('equipped').count).to eq 0
    end

    it 'should filter by item type' do
      create(:item, item_type: 'arcane')
      create(:item, item_type: 'arcane')
      create(:item, item_type: 'weapon')

      expect(Item.item_type_eq('arcane').count).to eq 2
      expect(Item.item_type_eq('weapon').count).to eq 1
      expect(Item.item_type_eq('gear').count).to eq 0
    end

    it 'should filter by item quality' do
      create(:item, quality: 'rare')
      create(:item, quality: 'very_rare')
      create(:item, quality: 'common')
      create(:item, quality: 'common')

      expect(Item.quality_eq('common').count).to eq 2
      expect(Item.quality_eq('rare').count).to eq 1
      expect(Item.quality_eq('legendary').count).to eq 0
    end
  end
end