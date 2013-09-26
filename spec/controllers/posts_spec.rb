require 'spec_helper'

describe PostsController do
  describe '#show' do
    before(:each) do
      5.times do |i|
        Post.create(title: "The Best Post Ever #{i}", body: 'Lorem Ipsum', views: 0)
      end
    end
    it "increments number of views" do
      post = Post.first
      expect(post.views).to eq 0
      get :show, id: post.id
      post.reload
      expect(post.views).to eq 1
    end

    it "fetches a random post" do
      post = Post.first
      get :show, id: post.id
      assigns(:random_post).should be_an_instance_of(Post)
    end
  end

  describe "#index" do
    before(:each) do
      5.times do |i|
        Post.create(title: "The Best Post Ever #{i}", body: 'Lorem Ipsum', views: 0)
      end
    end
    it "fetches a random post" do
      get :index
      assigns(:random_post).should be_an_instance_of(Post)
    end
  end
end
