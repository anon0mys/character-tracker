require 'rails_helper'

describe 'Schema#user_by_id' do
  let(:user) { create(:user) }
  before { create_list(:user, 4) }

  it 'should return a user' do
    user_query = "
    query {
      user(id: 1) {
        email
        characters {
          name
        }
      }
    }
    "
    result = Schema.execute(user_query)

    require 'pry'; binding.pry()
  end
end

