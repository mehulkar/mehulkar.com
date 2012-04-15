require 'spec_helper'

describe Post do 

	it 'is valid with a title, body, and category' do
			Post.new(title: 'something', body: 'something', category_id: 1).should be_valid
	end
	
	it "has a valid Factory" do
		FactoryGirl.create(:post).should be_valid
	end

	describe "validity" do
		it "is invalid without a title" do
			FactoryGirl.build(:post, title: nil).should_not be_valid
		end

		it 'is invalid without a body' do
			FactoryGirl.build(:post, body: nil).should_not be_valid
		end

		it "is invalid without a category" do 
			FactoryGirl.build(:post, category_id: nil).should_not be_valid
		end

	end

	describe "associations"	 do
		before(:each) do
			@category = FactoryGirl.create(:category)
			@post = FactoryGirl.create(:post, category_id: @category.id)
		end
		it "defaults to 'uncatgorized' category" do
			@post.category.name.should eq 'uncategorized'
		end
		it "defaults to nil project" do
			@post.project.should eq nil
		end
		it "has many votes" do
			@post.votes.build.should be_valid
		end
		it "has many comments"
		it "belongs to an author"
	end
end