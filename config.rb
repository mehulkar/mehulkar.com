set :css_dir,         'stylesheets'
set :js_dir,          'javascripts'
set :images_dir,      'images'
set :relative_links,  true
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true, underline: true

activate :directory_indexes

activate :syntax

page 'blog/*',        layout: :post
page 'poetry.*',      layout: :category
page 'quotations.*',  layout: :category
page 'books.*',       layout: :category
page 'ninjatennis.*', layout: :category

configure :development do
  activate :livereload
end

configure :build do
  activate :minify_css
  activate :minify_javascript   # Minify Javascript on build
  activate :asset_hash          # Enable cache buster
  activate :relative_assets
end

helpers do
  TOP_LEVEL_DIR = Dir.pwd
  BLOG_BASE_DIR = File.join(TOP_LEVEL_DIR, 'source', 'blog')

  def blog_path;        '/blog' end
  def quotations_path;  '/quotations' end
  def poetry_path;      '/poetry' end
  def books_path;       '/books' end
  def ninjatennis_path; '/ninjatennis' end

  def posts_for_category(name)
    groups = post_files.group_by do |path|
      extensions[:frontmatter].data(path).first[:categories].split(' ').first
    end
    x = groups[name].map do |file|
      data_for_file(file)
    end
    x.sort {|x,y| Date.parse(y[:date]) <=> Date.parse(x[:date]) }
  end

  def post_groups
    post_files.map { |file|
      data_for_file(file)
    }.group_by { |x|
      Date.parse(x[:date]).strftime("%Y")
    }.sort_by { |year, posts|
      year
    }.reverse
  end

  def data_for_file(file)
    basename = File.basename(file).split('.')[0]
    path = file.match(/#{BLOG_BASE_DIR}\/(.*)\.md/)[1]
    {
      date: first_created(file),
      link: '/blog/' + path,
      title: extensions[:frontmatter].data(file).first[:title],
      categories: extensions[:frontmatter].data(file).first[:categories]
    }
  end

  def post_files
    Dir["#{BLOG_BASE_DIR}/**/*.md"]
  end

  def created_at
    if current_page.metadata[:page]["date"]
      Date.parse("#{current_page.metadata[:page]["date"]}").to_s
    else
      first_created(current_page.source_file)
    end
  end

  def categories(path)
    str = `cat #{path} | grep categories:`
    str ||= ""
    str.split("categories: ")[1]
  end

  def first_created(path)
    date_line = `cat #{path} | grep date:`
    if date_line.empty?
      date = `git log --follow --date=short --pretty=format:%ad --diff-filter=A -- #{path}`
      date = Date.today.to_s if date.empty?
    else
      date = date_line.split(" ")[1]
    end
    date
  end
end
