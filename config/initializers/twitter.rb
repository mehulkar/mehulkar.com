# These are set as config variables on heroku
# You can access them from the Heroku CLI Toolbelt with `heroku config`
# https://devcenter.heroku.com/articles/config-vars
# We'll only use this in production though. For development,
# we'll use the config in secrets.rb. secrets.rb is not committed to git so it is unavailable on Heroku
if Rails.env == "production"
  Twitter.configure do |config|
    config.consumer_key       = ENV['TWITTER_CONSUMER_KEY']
    config.consumer_secret    = ENV['TWITTER_CONSUMER_SECRET']
    config.oauth_token        = ENV['TWITTER_OAUTH_TOKEN']
    config.oauth_token_secret = ENV['TWITTER_OAUTH_SECRET']
  end
end