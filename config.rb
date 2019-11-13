require_relative './lib/category'
require_relative './lib/post'
require 'pry'

set :css_dir,         'stylesheets'
set :js_dir,          'javascripts'
set :images_dir,      'images'
set :relative_links,  true
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true, underline: true

activate :directory_indexes
activate :syntax
activate :sprockets

page 'blog/*',        layout: :post
page 'blog/category/poetry.*',      layout: :category
page 'blog/category/quotations.*',  layout: :category
page 'blog/category/books.*',       layout: :category
page 'blog/category/ninjatennis.*', layout: :category
page 'blog/category/programming.*', layout: :category
page 'blog/category/three-musics.*', layout: :category
page 'blog/category/til.*',           layout: :category
page 'blog/category/tech.*',           layout: :category

configure :build do
  activate :minify_css
  activate :minify_javascript   # Minify Javascript on build
  activate :asset_hash          # Enable cache buster
  activate :relative_assets
end

helpers do
  def home_path;        '/'             end
  def quote_path;       '/blog/category/quotations'   end
  def poetry_path;      '/blog/category/poetry'       end
  def books_path;       '/blog/category/books'        end
  def ninjatennis_path; '/blog/category/ninjatennis'  end
  def programming_path; '/blog/category/programming'  end
  def threemusics_path; '/blog/category/three-musics' end
  def til_path;         '/blog/category/til'          end
  def tech_path;        '/blog/category/tech'          end

  def path_for(category)
    route_path = Category.new(category).route_path
    self.send(route_path)
  end

  def path_exists?(category)
    path = Category.new(category).route_path
    self.send(path)
    true
  rescue
    false
  end

  def formatted_date(date)
    date.strftime("%b %d")
  end

  def full_date(date)
    date.strftime("%b %d, %Y")
  end

  def posts_for_category(name)
    by_category = Post.by_category
    for_category = by_category[name]
    PostCollection.new(for_category).by_year
  end

  def created_at
    Post.new(current_page.source_file).date
  end
end
