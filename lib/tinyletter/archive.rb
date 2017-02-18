require_relative './utils'

module TinyLetter
  class Archive
    include Utils

    attr_reader :page_links

    def initialize
      @page_links = []
    end

    def find_links(url, recursive=true)
      archive_page = fetch_html(url)
      archive_page.css('.message-link').map do |x|
        @page_links << x.attributes['href'].value
      end

      if recursive
        next_button = archive_page.css('.paging-button.next').first
        next_path = next_button.attributes['href'].value
        return if next_path.match(%r{javascript:void})
        uri = URI(url)
        find_links("#{uri.scheme}://#{uri.host}#{next_path}", recursive=true)
      end
    end
  end
end
