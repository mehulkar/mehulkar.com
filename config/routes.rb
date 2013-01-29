Blog::Application.routes.draw do
  root to: 'static_pages#home'
  
  resources :posts
  resources :projects

  match "/about" => 'static_pages#about'
  match "/portfolio" => 'projects#index'
  match "/writes" => 'posts#index'
end