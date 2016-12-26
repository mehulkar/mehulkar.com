#!/usr/bin/env ruby

print "Name of post: "
title = gets.chomp
parameterized = title.split(" ").map(&:downcase).join('-')

now  = Time.now
year = now.strftime('%Y')
month = now.strftime('%m')
full_date = now.strftime('%Y-%m-%d')

dir = File.join('source', 'blog', year, month)

# make sure directory exists
FileUtils.mkdir_p(dir)

filepath = File.join(dir, "#{parameterized}.md")

file = File.open(filepath, 'w+') do |f|
  f.write("---\n")
  f.write("title: #{title}\n")
  f.write("date: #{full_date}\n")
  f.write("categories: \n")
  f.write("---\n")
  f
end

`git checkout -b blog-#{parameterized}`

`subl #{file.path}`
