---
title: Using Python Virtualenvs
date: 2017-10-17
categories: programming
---

I've been working on a Python project for the last year. Coming from
a cushy "convention over configuration" life of Ruby on Rails and ember-cli,
it has been confusing and frustrating to find a pattern for myself to work efficiently.
When I asked for help from the community, the general answer I got was
"this is how I've done it for the last 10 years", or "here's a 200 line script I
wrote for this". This was incredibly frustrating for someone like me who likes to
do things the right way to avoid digging myself into an unnecessary hole.

One of the main things I had trouble with was learning how to specify dependencies
and their versions for a project. I was told to "just use virtualenv" many times,
but it was not clear how to actually use it. In the beginning, I tried out the
[`pyenv-virtualenv`][1] project, because it seemed to be similar to `rvm` or `nvm`.
I had hoped to be able to define my Python version and a set of packages with it,
but [it turns out][2] that it was not meant to do that.

I ended up defining my own conventions for using `virtualenv`. I'm not sure they
are the best conventions, but they work. And so I become another Python developer
who will impart conventions to you based on personal usage, rather than community
consensus:

- `pip install --user virtualenv` globally for your user so that you can always
virtual environments. As a side note, I now always use the `--user` flag with
`pip install` if you are installing outside a `virtualenv`. This means you don't
have to use `sudo` or change the ownership of paths in `/Library` to use global packages.
- Create one `virtualenv` per project and activate it when you start working
on that project. In Ruby, when you `cd` into a directory `rvm` will read a
`.ruby-gemset` file to activate the correct named gemset. This means that your
gemset can be stored in a shared space outside your project. However, this involves
overriding `cd`, which can be confusing. It worked best for me to activate my
`virtualenv` manually, but I created a shell function to help:

    ```bash
    function v() {
      name="${1-env}"
      echo "Activating $name"
      virtualenv $name > /dev/null
      source "$name/bin/activate"
    }
    ```

    If you're wondering, running this function multiple times is safe, because
    it turns out that creating a virtualenv from inside a virtualenv doesn't seem
    to create a Russian doll hierarchy (thank goodness).

- Don't attempt to share virtual environments across projects. The only advantage
of this seems to be in automation or if you need to be stringent with disk space
usage.
- Define a `requirements.txt` that simply contains `-e .`, so that when you run
`pip install -r requirements.txt`, it installs all the dependencies listed in
`setup.py` into your virtualenv. This is a convoluted setup, but it turned out
to be more confusing to specify all dependencies in `requirements.txt` directly.
- Lastly, don't let experienced Python devs tell you that tooling in Python
is straightforward or "simple". It is not.

There are several other parts of Python development that I found confusing, such
as optimal directory structure and writing tests, but I will save those for
a different post some other time.


[1]: https://github.com/pyenv/pyenv-virtualenv
[2]: https://github.com/pyenv/pyenv-virtualenv/issues/190
