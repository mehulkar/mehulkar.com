class PostsController < ApplicationController
  
  def index
    @posts = Post.all.sort_by(&:created_at).reverse
    @markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :fenced_code_blocks => true)
  end

  def show
    @posts = Post.all.sort_by(&:created_at).reverse
    @post = Post.find(params[:id])
    @markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, :fenced_code_blocks => true)
  end

  def new
    @post = Post.new
  end


  def edit
    @post = Post.find(params[:id])
  end

  def create
    @post = Post.new(params[:post])
    if @post.save 
      redirect_to @post 
    else
      render action: 'new'
    end
  end


  def update
    @post = Post.find(params[:id])
    if @post.update_attributes(params[:post])
      redirect_to @post
    else
      render action: "edit"
    end
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy
    redirect_to posts_url
  end
end
