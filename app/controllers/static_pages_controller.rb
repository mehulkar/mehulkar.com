class StaticPagesController < ApplicationController
  def home
  end

  def about
  end

  def portfolio
  	@projects = Project.all
  end

  def shit_aaron_says
    
  end
end