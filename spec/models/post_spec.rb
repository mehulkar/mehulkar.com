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
end