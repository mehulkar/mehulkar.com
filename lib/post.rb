#!/usr/bin/env ruby
require 'fileutils'

class Post
  attr_reader :file_path
  def initialize(title, current_time=Time.now)
    @title = title
    @current_time = current_time
  end

  def parameterized_title
    title.split(" ").map(&:downcase).join('-')
  end

  def create
    dir = File.join('source', 'blog', year, month)
    FileUtils.mkdir_p(dir)

    @file_path = File.join(dir, "#{parameterized_title}.md")

    file = File.open(@file_path, 'w+') do |f|
      f.write("---\n")
      f.write("title: #{title}\n")
      f.write("date: #{full_date}\n")
      f.write("categories: \n")
      f.write("---\n")
      f
    end
  end

  def write_body(body)
    File.open(@file_path, 'a+') do |f|
      f.write(body)
      f.write("\n")
    end
  end

  private

  attr_reader :title, :current_time

  def year
    current_time.strftime('%Y')
  end

  def month
    current_time.strftime('%m')
  end

  def full_date
    current_time.strftime('%Y-%m-%d')
  end
end
