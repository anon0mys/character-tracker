Rails.application.routes.draw do
  root to: "home#index"

  mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql" if Rails.env.development?
  post "/graphql", to: "graphql#execute"

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)

  scope :api, defaults: { format: :json } do
    scope :v1 do
      devise_for :users, controllers: {
                           sessions: :sessions,
                           registrations: :registrations,
                         },
        path_names: { sign_in: :login, sign_out: :logout }
    end
  end

  namespace :api do
    namespace :v1 do
      resources :characters, only: %i[index show create update destroy] do
        resources :attacks, only: %i[index create update destroy]
        resources :character_trackers, only: %i[index create update destroy], path: "trackers",
          controller: "character/trackers"
        resources :spell_lists, only: %i[index create show update destroy] do
          post "/add_spell", to: "spell_lists#add_spell"
        end
        resources :features, only: %i[index create update destroy]
        resources :feats, only: %i[create destroy], controller: "character_feats"
        resources :loadouts, only: %i[index create update destroy] do
          post :activate, on: :member
        end
        post :rest, to: "characters#rest"
      end
      resources :spells, only: [:index]
      resources :archetypes, only: [:index]
      resources :monsters, only: [:index]
      resources :races, only: [:index] do
        get :options, on: :collection
      end
      resources :backgrounds, only: [:index] do
        get :options, on: :collection
      end
      resources :feats, only: [:index]
      resources :items, only: %i[index create update]
      resources :games, only: %i[index show create update destroy] do
        resources :journal_entries, only: %i[index show create update destroy]
        resources :mentions, only: [:index]
        resources :journal_mentions, only: [:index]
        resources :holdings, only: %i[index show create update destroy]
        resources :npcs, only: %i[index show create update]
        resources :locations, only: %i[index show create update destroy]
      end
      get "users/me", to: "users#me"
      patch "users/current_character", to: "users#set_current_character"
    end
  end

  get "*path", to: "home#index"
end
