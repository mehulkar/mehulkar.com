atom_feed do |feed|
  feed.title "Mehul Kar - Blog"
  feed.updated @posts.maximum(:updated_at)

  @posts.each do |post|
    feed.entry post do |entry|
      entry.title post.title
      entry.content @markdown.render(post.body).html_safe
      entry.author do |author|
        author.name "Mehul Kar"
      end
    end
  end
end