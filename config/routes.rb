Rails.application.routes.draw do
  root to: 'home#index'

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope :api, defaults: { format: :json } do
    scope :v1 do
      devise_for :users, controllers: {
                          sessions: :sessions,
                          registrations: :registrations
                         },
                         path_names: { sign_in: :login, sign_out: :logout }
    end
  end

  namespace :api do
    namespace :v1 do
      resources :characters, only: [:index, :show, :create, :update, :destroy] do
        resources :spell_lists, only: [:index, :create, :show, :update, :destroy] do
          post '/add_spell', to: 'spell_lists#add_spell'
        end
      end
      resources :spells, only: [:index]
    end
  end

  get '*path', to: 'home#index'
end
