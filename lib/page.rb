class Page
  attr_reader :path

  def initialize(path)
    @path = path
  end

  def filename
    File.basename(@path, '.html.md')
  end

  def categories
    data['categories'].split(' ')
  end

  def title
    data['title'] || filename
  end

  private

  def data
    @data ||= FrontMatterParser.parse_file(@path)
  end
end
