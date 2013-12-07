require 'spec_helper'

describe Post do
  describe '#increment_views' do
    it "should increment views" do
      post = Post.create(title: 'The Best Post Ever', body: 'Lorem Ipsum', views: 0)
      post.increment_views
      post.reload
      expect(post.views).to eq 1
    end
  end

  describe ".random" do
    it "should return one record" do
      5.times do |i|
        Post.create(title: "The Best Post Ever #{i}", body: 'Lorem Ipsum', views: 0)
      end
      post = Post.random
      post.should be_an_instance_of(Post)
    end
  end
end