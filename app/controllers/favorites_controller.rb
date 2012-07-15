class FavoritesController < ApplicationController
  respond_to :json
  def index
    @favorites = User.first.favorites
    render :json => @favorites
  end
end