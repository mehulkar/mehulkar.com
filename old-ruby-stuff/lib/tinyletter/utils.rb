require 'open-uri'
require 'nokogiri'

module TinyLetter
  module Utils
    def fetch_html(url)
      Nokogiri::HTML(open(url))
    end
  end
end
