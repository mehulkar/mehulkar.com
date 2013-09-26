require 'spec_helper'

describe PostsController do
  describe '#show' do
    it "increments number of views" do
      post = Post.create(title: 'The Best Post Ever', body: 'Lorem Ipsum', views: 0)
      expect(post.views).to eq 0
      get(post_path(post))
      post.reload
      expect(post.views).to eq 1
    end
  end
end
