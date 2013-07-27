class Post < ActiveRecord::Base
  validates_presence_of :title, :body
  belongs_to :category

  after_create :tweet

  def formatted_title
    title.split(' ').map(&:capitalize).join(' ')
  end

  # this is used for tweeting after create
  def url
    "http://mehulkar.com/posts/#{self.id}"
  end

  def tweet_text
    "#{self.title} - #{self.url}"
  end

  def tweet
    if Rails.env.production?
      begin
        Twitter.update(tweet_text)
      rescue => e
        puts "#{e.inspect} - #{tweet_text}"
      end
    end
  end
end