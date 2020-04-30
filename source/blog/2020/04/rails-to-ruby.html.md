---
title: Rails to Ruby
date: 2020-04-30
categories: programming, rails
---

I have some `rake` tasks that sit alongisde a Rails app that fetch data from remote
sources and stuff into the database. These tasks sun in a background worker every 5 minutes. In Rails, rake tasks can load the entire Rails
environment with the `environment` option:

```ruby
task some_task: :environment do
  SomeClass.do_my_thing!
end
```

My task was to move these tasks from the infrastructure where the Rails app lives
into a CI-like environment that executes short-lived tasks more efficiently,
and exposes better logs. The purpose of this move was to be able to debug errors
in the data syncs more easily, restart them on demand, and to isolate logs
away from the web server.

Because the new system does not have access to the production database server,
I had to make my rake tasks run independently and `POST` the data to the Rails server
at a privileged API endpoint.

Intro aside, the biggest hurdle I ran into during this conversion was to load code without Rails' autoloading feature.
Rails does this fantastic thing where you can reference any class from anywhere.
Code in Controllers or classes in `lib/` can reference models, Models can reference classes from installed gems, etc. There are a set of rules that govern this automatic loading
behavior and its configurable with `config.autoload_paths`, but the point is that it's rare
to need explicit `require` statements.

Converting my rake task to run without loading the Rails environment made it painfully obvious
that organizing code that doesn't come with its own structure is challenging! The good news is
that I ended up with a decent pattern for using `require` and `require_relative` effectively:

> Use `require` for files outside the module and `require_relative` for files _inside_ the same module.

To illustrate, here's a sample directory structure:

```bash
thing_1
  - foo.rb
  - bar.rb
thing_2
  - baz.rb
thing_1.rb
thing_2.rb
```

Note that `thing_1` has both a root level file and a root level directory. The _file_ `thing_1.rb` looks like this:

```ruby
# thing_1.rb
Dir["./thing_1/**/*.rb"].each { |f| require f }

module Thing1
end
```

and `thing1/foo.rb` looks like this:

```ruby
### thing1/foo.rb
module Thing1
  class Foo
  end
end
```

If `thing_2/baz.rb` wants to use the `Thing1::Foo` class, it can require
it like this:

```ruby
# thing2/baz.rb
require './thing_1'
```

but if `thing_1/bar.rb` wants to use `Thing1::Foo` (inside the same module), it can require it like this:

```ruby
# thing1/bar.rb
require_relative './foo'
```

The tradeoff for this is that `thing_1` is all-or-nothing. `thing_2` cannot
import `Thing1::Foo` without also importing `Thing1::Bar`. I tend to think
this tradeoff is worth it, and if a module gets too big, it's time to think
of how to break it down further.

Another thing worth noting here is that `require` always runs relative to `$CWD`, whereas `require_relative` runs relative to `__FILE__` (the current file). So if `thing2/baz.rb` really wanted to require *only* `thing1/foo.rb` (and not `thing1/bar.rb`), its two options would be:

```ruby
require_relative '../thing1/foo.rb'
# or
require './thing1/foo.rb'
````

I found that it was easier to constrain myself to requireing only the top level "loader" files than to reach into other modules and require indivudual
files and have to remember the right path to use.
