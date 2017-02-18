#!/usr/bin/env ruby
require_relative '../lib/post'
require_relative '../lib/tinyletter/tinyletter'

ARCHIVE_URL = ENV['ARCHIVE_URL'] || ARGV[0]

if !ARCHIVE_URL
  print "Enter your TinyLetter archive page: "
  ARCHIVE_URL = gets.chomp
end

archive = TinyLetter::Archive.new
archive.find_links(ARCHIVE_URL, recursive=true)

total = archive.page_links.length

archive.page_links.each_with_index do |link, i|
  letter = TinyLetter::Letter.new(link).tap(&:get)

  puts "[#{i}/#{total}] Creating post for #{letter.subject}"

  stripped_title = letter.subject.match(%r{Three\s?Musics:\s*(.*)})[1]

  post = Post.new(
    stripped_title,
    letter.date.to_time,
    ['three-musics'], # categories
  ).tap(&:create)

  post.write_body(letter.body)
end
