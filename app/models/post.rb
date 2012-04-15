class Post < ActiveRecord::Base
	validates_presence_of :title, :body, :category_id
	has_many :votes
	belongs_to :category
	belongs_to :project

end
