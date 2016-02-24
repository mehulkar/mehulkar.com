#!/usr/bin/env ruby

print "Name of post: "
title = gets.chomp
parameterized = title.split(" ").map(&:downcase).join('-')
filename = "source/blog/#{parameterized}.md"

file = File.open(filename, 'w+') do |f|
  f.write("---\n")
  f.write("title: #{title}\n")
  f.write("date: #{Time.now.strftime('%Y-%m-%d')}\n")
  f.write("categories: \n")
  f.write("---\n")
  f
end

`subl #{file.path}`
