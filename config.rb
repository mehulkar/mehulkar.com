set :css_dir,         'stylesheets'
set :js_dir,          'javascripts'
set :images_dir,      'images'
set :relative_links,  true
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true

activate :directory_indexes

activate :syntax

page "blog/*", :layout => :post

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
  POST_FILES = Dir["#{TOP_LEVEL_DIR}/source/blog/*"]
  def post_groups
    x = POST_FILES.map { |file|
      basename = File.basename(file).split('.')[0]
      {
        date: first_created(file),
        link: '/blog/' + basename,
        title: extensions[:frontmatter].data(file).first[:title],
        categories: extensions[:frontmatter].data(file).first[:categories]
      }
    }.group_by { |x|
      Date.parse(x[:date]).strftime("%Y")
    }.sort_by { |year, posts|
      year
    }.reverse
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
