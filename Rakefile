desc 'Start Middleman server'
task :run do
  system('middleman server')
end

desc "Publish website to master branch of origin"
task :publish do
  system("./bin/publish")
  system("rm -rf build")
end

desc 'Create a new post'
task :new do
  system('./bin/new_post.rb')
end

task :default => :publish
