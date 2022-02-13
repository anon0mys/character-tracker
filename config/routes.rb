Rails.application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope :api, defaults: { format: :json } do
    scope :v1 do
      devise_for :users, controllers: {
                          sessions: :sessions,
                          registrations: :registrations
                         },
                         path_names: { sign_in: :login }
    end
  end

  namespace :api do
    namespace :v1 do
      resources :characters, only: [:index, :show, :create, :update, :destroy]
      resources :spells, only: [:index]
    end
  end
end
