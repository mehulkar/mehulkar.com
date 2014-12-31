set :css_dir,         'stylesheets'
set :js_dir,          'javascripts'
set :images_dir,      'images'
set :relative_links,  true
set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true
activate :directory_indexes

activate :syntax, line_numbers: true
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
  def posts
    POST_FILES.map do |file|
      basename = File.basename(file).split('.')[0]
      {
        date: first_created(file),
        link: '/blog/' + basename,
        title: basename.gsub('-', ' ').capitalize
      }
    end
  end

  def created_at
    first_created(current_page.source_file)
  end

  def first_created(path)
    `git log --follow --date=short --pretty=format:%ad --diff-filter=A -- #{path}`
  end
end