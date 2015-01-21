desc "Publish website to master branch of origin"
task :publish do
  system("./bin/publish")
  system("rm -rf build")
end

task :default => :publish
