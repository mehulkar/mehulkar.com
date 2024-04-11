---
title: "Rails Postgres OSX Install"
date: 2013-01-10 00:00:00
tags:
- programming
- rails
---

I can never get Rails to connect to the Postgres server in development. I'll write a fuller tutorial that explains things better later, but I can explain some really basic things first.

The issue is that osx is looking for the server socket in a default location and postgres is putting the client in a default location. Those locations are not the same.

Postgres puts the socket in `/var/pgsql_socket`. Or at least that is where mine is at the moment. This is configurable in a `postgres.conf` file. You can do a global search for this file in terminal by running `sudo find / -name postgres.conf`. In that file look for the line that says `unix_socket_directory`. You could probably edit that and tell postgres to put the socket somewhere else, but more on that later.

The client, in this case Rails, needs to know where to look for the socket. When I started my Rails server, it would crash saying it couldn't find the socket file in `/tmp/.s.PGSQL.5432`. So now at least I know where Rails is looking by default. I don't know what is doing the looking and if we could change the default settings on that (maybe it's the `pg` gem?), but more on that later.

My original hack solution (I finally remembered) had been to put a symlink for the actual location of the socket file (`.s.PGSQL.5432`) into `/tmp`. This worked fine, until I restarted and the file was deleted. I don't restart my computer very often so I had no idea what I had done the last time to fix it. Tonight is about the 5th time this has happened in a 2-3 months and after a couple hours of figuring things out again and a conversation with RhodiumToad in `#postgresql` on Freenode I figured out that it was better to configure this on the client. And a couple Goog searches later, viola!

In `database.yaml` I set my `host` property under development to `/var/pgsql_socket`. Restart the server. And now, I am feeling fulfilled and happy.

This may or may not help anyone else because as [Jesse](//github.com/jfarmer) pointed out earlier today, the problem is that everyone's system is different. Everyone has installed postgres differently. This makes a huge difference.

But this gist definitely won't help if you haven't already spent some time in terminal and with unixy things. If that is the case, [ask a question](http://youtu.be/SLYMLt4MQ0Y?t=10m05s).

Good night.
