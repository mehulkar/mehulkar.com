#!/usr/bin/env ruby
require 'fileutils'

class NewPost
  attr_reader :file_path
  attr_accessor :categories

  def initialize(title, current_time=Time.now, categories=[])
    @title = title
    @current_time = current_time.freeze
    @categories = categories
  end

  def parameterized_title
    title.gsub(/[^a-zA-Z0-9 -]/, '').split(" ").map(&:downcase).join('-')
  end

  def create
    dir = File.join('source', 'blog', year, month)
    FileUtils.mkdir_p(dir)

    @file_path = File.join(dir, "#{parameterized_title}.html.md")

    file = File.open(@file_path, 'w+') do |f|
      f.write("---\n")
      f.write("title: #{title}\n")
      f.write("date: #{full_date}\n")
      f.write("categories: #{categories.join(',')}\n")
      f.write("---\n\n")
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
