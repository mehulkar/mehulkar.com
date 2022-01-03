require_relative './utils'

module TinyLetter
  class Letter
    include Utils
    attr_reader :url

    def initialize(url)
      @url = url
    end

    def get
      @nokogiri_page ||= fetch_html(url)
    end

    def date
      return @_date if @_date
      string = nokogiri_page.css('#message-heading .date').first.text.strip
      @_date = Date.strptime(string, '%B %d, %Y')
    end

    def subject
      @_title ||= nokogiri_page.css('#message-heading .subject').first.text.strip
    end

    def body
      @_body ||= nokogiri_page.css('.message-body').first.inner_html
    end

    private

    attr_reader :nokogiri_page
  end
end
