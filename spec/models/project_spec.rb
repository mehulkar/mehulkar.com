require 'spec_helper'

describe Project do
	it 'has a valid factory' do
		FactoryGirl.build(:project).should be_valid
	end
  it "is invalid without a name" do
  	FactoryGirl.build(:project, name: nil).should_not be_valid
  end
  it "is invalid without a status" do
  	FactoryGirl.build(:project, status: nil).should_not be_valid
  end
  it "is invalid without visibility" do
  	project = FactoryGirl.build(:project)
  	project.should respond_to(:visibility)
  end

  it "defaults visibility to true" do
  	project = Project.create(name:'something', status:'started')
  	project.visibility.should eq true
  end
end
