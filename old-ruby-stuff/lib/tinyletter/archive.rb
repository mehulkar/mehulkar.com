require_relative './utils'

module TinyLetter
  class Archive
    include Utils

    HOST = 'http://tinyletter.com'

    attr_reader :name, :page_links

    def initialize(name)
      @name = name
      @page_links = []
    end

    def archive_url
      "#{HOST}/#{name}/archive"
    end

    def find_links(recursive=true, url=archive_url)
      archive_page = fetch_html(url)
      archive_page.css('.message-link').map do |x|
        @page_links << x.attributes['href'].value
      end

      if recursive
        next_button = archive_page.css('.paging-button.next').first
        next_path = next_button.attributes['href'].value
        return if next_path.match(%r{javascript:void})
        uri = URI(url)
        find_links(recursive=true, "#{uri.scheme}://#{uri.host}#{next_path}")
      end
    end
  end
end
