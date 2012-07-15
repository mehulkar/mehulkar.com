require 'spec_helper'

describe Category do
  it "is invalid without a name" do
  	Category.new.should_not be_valid
  end

  it "is valid with a name" do
  	Category.new(name: 'something').should be_valid
  end

  it "correctly associates with posts" do
  	cat = Category.new(name: 'something')
  	cat.posts.should_not be nil
  end

  it {should respond_to(:description)}
end
