require 'spec_helper'

describe Vote do
  it "is invalid without a post_id" do
  	Vote.new.should_not be_valid
  end

  it "is valid with a post_id" do
  	post = FactoryGirl.create(:post)
  	Vote.new(post_id:post.id).should be_valid
  end

  it "correctly associates with posts" do
  	post = FactoryGirl.create(:post)
  	vote = post.votes.create
  	vote.post.should eq post
  end
end
