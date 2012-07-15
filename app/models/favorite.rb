class Favorite < ActiveRecord::Base
  attr_accessible :id, :link, :text, :user_id
  belongs_to :user
end
