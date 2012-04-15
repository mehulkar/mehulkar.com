require 'spec_helper'

require 'spec_helper'

describe PostsController do
  describe "GET #index" do
    it "populates an array of posts" do
    	post = FactoryGirl.create(:post)
    	get :index
    	assigns(:posts).should eq ([post])
    end
    it "renders the :index view" do
    	get :index
    	response.should render_template :index
    end
  end
  
	describe "GET #show" do
	  it "assigns the requested post to @post" do
	    post = FactoryGirl.create(:post)
	    get :show, id: post
	    assigns(:post).should eq(post)
	  end
	  
	  it "renders the #show view" do
	    get :show, id: FactoryGirl.create(:post)
	    response.should render_template :show
	  end
	end
  
  describe "GET #new" do
    it "assigns a new post to @post" do
    	get :new
    	assigns(:post).should be_a_kind_of Post
    end
    it "renders the :new template" do
    	get :new
    	response.should render_template :new
    end

  end
  
  describe "POST #create" do
    context "with valid attributes" do
      it "redirects to the home page" do 
      	post :create, post: FactoryGirl.attributes_for(:post)
      	response.should redirect_to posts_path
      end
    end
    
    context "with invalid attributes" do
      it "re-renders the :new template" do
      	post :create, post: FactoryGirl.build(:post, title:nil) #invalid post
      	response.should render_template :new
      end
    end
  end
end