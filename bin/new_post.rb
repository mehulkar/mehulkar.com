#!/usr/bin/env ruby
require 'fileutils'
require_relative '../lib/post'

print "Name of post: "
title = gets.chomp

puts "Creating new post"
post = Post.new(title).tap(&:create)

puts "Checking out new branch"
`git checkout -b blog-#{post.parameterized_title}`

puts "Opening #{post.file_path}"
`subl #{post.file_path}`

# exit(0)
