require 'spec_helper'

describe ProjectsController do
  describe "GET #index" do
    it "populates an array of posts" do
    	project = FactoryGirl.create(:project)
    	get :index
    	assigns(:projects).should eq ([project])
    end
    it "renders the :index view" do
    	get :index
    	response.should render_template :index
    end
  end
  
	describe "GET #show" do
		before (:each) {@project = FactoryGirl.create(:project)}

	  it "assigns the requested project to @project" do
	    get :show, id: @project
	    assigns(:project).should eq(@project)
	  end
	  
	  it "renders the #show view" do
	    get :show, id: @project
	    response.should render_template :show
	  end
	end
  
  describe "GET #new" do
    it "assigns a new project to @project" do
    	get :new
    	assigns(:project).should be_a_kind_of Project
    end
    it "renders the :new template" do
    	get :new
    	response.should render_template :new
    end
  end 
  
  describe "project #create" do
    context "with valid attributes" do
      it "redirects to the home page" do 
      	post :create, project: FactoryGirl.attributes_for(:project)
      	response.should redirect_to projects_path
      end
    end
    
    context "with invalid attributes" do
      it "re-renders the :new template" do
      	post :create, project: FactoryGirl.attributes_for(:project, name: nil) #invalid project
      	response.should render_template :new
      end
    end
  end
end