#!/usr/bin/env ruby
require_relative '../lib/post'
require_relative '../lib/tinyletter/tinyletter'

TINYLETTER_NAME = ENV['TINYLETTER_NAME'] || ARGV[0]

if !TINYLETTER_NAME
  print "Enter your TinyLetter name: "
  TINYLETTER_NAME = gets.chomp
end

archive = TinyLetter::Archive.new(TINYLETTER_NAME)
archive.find_links(recursive=true)

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
