require 'front_matter_parser'

class Post
  TOP_LEVEL_DIR = Dir.pwd
  BLOG_BASE_DIR = File.join(TOP_LEVEL_DIR, 'source', 'blog')

  POST_FILES = Dir["#{BLOG_BASE_DIR}/**/*.md"]

  def self.all
    POST_FILES
  end

  def self.by_category
    @_posts_by_category ||= begin
      _by_cat = Hash.new {|h,k| h[k] = Array.new }

      all.each do |file|
        categories = Parser.load(file)['categories'] || ""
        categories.split(',').map(&:strip).each do |c|
          _by_cat[c] << file
        end
      end

      _by_cat
    end
  end

  def self.by_year
    all.map { |file|
      new(file)
    }.sort_by(&:date)
    .reverse
    .group_by(&:year).sort_by { |year, posts|
      year
    }.reverse
  end

  def initialize(file_path)
    @file_path = file_path
  end

  def link
    path = @file_path.match(/#{BLOG_BASE_DIR}\/(.*)\.md/)[1]
    "/blog/#{path}"
  end

  def title
    frontmatter['title']
  end

  def categories
    @categories ||= (frontmatter['categories'] || '').split(',').map(&:strip)
  end

  def year
    date.strftime("%Y")
  end

  def date
    date = frontmatter['date'] || DateFromGitLog.new(@file_path).to_date
    date.to_date
  end

  def exists?
    File.exists? @file_path
  end

  private

  def frontmatter
    @frontmatter ||= Parser.load(@file_path)
  end
end

class Parser
  def self.load(file)
    unsafe_loader = ->(string) { YAML.load(string) }
    FrontMatterParser::Parser.parse_file(
      file,
      loader: unsafe_loader
    ).front_matter
  rescue
    {}
  end
end

class DateFromGitLog
  def initialize(path)
    @path = path
  end

  def to_s
    @_date_from_git ||= `git log --follow --date=short --pretty=format:%ad --diff-filter=A -- #{@path}`
  end

  def to_date
    Date.parse(to_s)
  end
end
