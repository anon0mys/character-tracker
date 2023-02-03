require 'rails_helper'

describe 'GET /api/v1/items' do
  let(:user) { create(:user) }
  before { create_list(:item, 49) }
  before { create(:item, name: 'Item of Search')}

  context 'as an authenticated user' do
    before { sign_in(user) }

    context 'with no filter' do
      it 'should return a paginated list of items' do
        get api_v1_items_path, headers: @auth_headers
        result = JSON.parse(response.body)
        items = Item.limit(20)
        expect(result['data'].count).to eq 20
        expect(result['data'][0]['id']).to eq items.first.id
        expect(result['data'][-1]['id']).to eq items.last.id
      end

      it 'should be able to return the next page' do
        get api_v1_items_path + '?page=2', headers: @auth_headers
        result = JSON.parse(response.body)
        items = Item.offset(20).limit(20)
        expect(result['data'].count).to eq 20
        expect(result['data'][0]['id']).to eq items.first.id
        expect(result['data'][-1]['id']).to eq items.last.id
      end

      it 'should return pagination metadata' do
        get api_v1_items_path, headers: @auth_headers
        result = JSON.parse(response.body)
        expect(result['page']).to eq 1
        expect(result['prev']).to be nil
        expect(result['next']).to eq 2
        expect(result['pages']).to eq 3
      end
    end

    context 'with filters' do
      it 'should filter by name' do
        get api_v1_items_path + '?name=search', headers: @auth_headers
        result = JSON.parse(response.body)
        expect(result['data'].count).to eq Item.where('name ILIKE ?', "%search%").count
      end

      it 'should filter by status' do
        get api_v1_items_path + '?status=stored', headers: @auth_headers
        result = JSON.parse(response.body)
        expect(result['data'].count).to eq Item.where(status: 'stored').count
      end

      it 'should filter by quality' do
        get api_v1_items_path + '?quality=common', headers: @auth_headers
        result = JSON.parse(response.body)
        expect(result['data'].count).to eq Item.where(quality: 'common').count
      end

      it 'should filter by item_type' do
        get api_v1_items_path + '?item_type=armor', headers: @auth_headers
        result = JSON.parse(response.body)
        expect(result['data'].count).to eq Item.where(item_type: 'armor').count
      end

      it 'should be able to combine filters' do
        create(:item, status: 'equipped', quality: 'legendary', item_type: 'weapon')
        get(
          api_v1_items_path + '?status=equipped&quality=legendary&item_type=weapon',
          headers: @auth_headers
        )
        result = JSON.parse(response.body)
        expect(result['data'].count).to eq Item
          .where(status: 'equipped', quality: 'legendary', item_type: 'weapon')
          .count
      end
    end
  end
end