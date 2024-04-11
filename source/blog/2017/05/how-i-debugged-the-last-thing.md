---
title: How I Debugged The Last Thing
date: 2017-05-02
tags:
- programming
- debugging
---

Early one morning, a few hours before my flight to RailsConf, a user emailed
saying that downloads were erroring out on one of the services I maintain.
I didn't remember deploying anything that might have caused it, so I replied with
the usual

> Weird, I'll look into it, can you file a bug report?

Side note: always file a bug report even if you're reaching out personally.
Bug reports are how maintainers track recurring issues, look up quick fixes, and
update other users about the status of a thing. An email conversation doesn't
scale simply because it doesn't have a URL. Side side note, aren't URLs and
linking such an amazing thing? For thousands of years we had books and we
couldn't hyperlink between them. Appreciate!

So downloads were breaking and I had a flight to catch. I drop everything and
ssh into the server, because that's the level of devops sophistication I have
reached in my career. While I'm shush'ing, I remember that I've recently
transferred all user uploaded artifacts to a 3rd party server, but I had
continuing writing uploads to the VM for now, because I wasn't 100% confident of
the 3rd party server yet. "It's been a while since I've started trusting the
3rd party", I think to myself. "Did I remember to turn off writing files locally
to my VM?" Even if I hadn't, this is a pretty big VM, I shouldn't run out of
disk space from it.

I'm into the server now. I compulsively type `ls` into the terminal, because
this is the first command I ever learned to type in a terminal and it will
forever be the first command I always type into a terminal. All seems well.
Then I type `ls /s` and the tab key and hit my first problem:

```
bash: cannot create temp file for here-document: No space left on device
```

Ok, well that's a pretty strong clue. `df -h` comes next and it reveals that
the disk is at 100% full. Oh geez. Flight leaves in 4 hours, which means I need
to leave for the airport in 2 and I have not packed yet.

Ok, what's taking up all this space? I look in my personal dotfiles for that one
alias I have for the command that prints out the 10 largest directories in the
current directory.

```bash
du -hsx * | sort -r | head -n 10
```

Ah, the log directory, of course. It's the output from the 5 cache warmers that
run every 5 minutes. Of course. The log file for each is a few gigs big.
Gross, I should file another bug to enable log rotation for these at some point.
I'll file the bug later. `rm *warmer.log`.

Another `df -h` and we're back at 70% disk space usage. Crisis averted.

I try out a couple downloads on the website and email the group and update the
bug report that everything should be back to normal for now even though the
underlying issue has not been resolved.

But something still seems off. Tab completion in bash still isn't working and
is throwing:

```
bash: cannot create temp file for here-document: No space left on device
```

A few minuter, the user responds to the ticket that downloads are still not
working. I try again a few times and it looks like they're failing every 2-3
times.

Clearly there is space left on the device now. I know it's a good idea not to
fill a disk over 50%, but at 70% it _should_ be working fine and it should
definitely have enough space to create a temp file for tab completion.
What's going on?

I remember that linux has a bunch of random caches that work pretty invisibly.
For example, sudo permission is stored in a cache the first time you use it, so
if you run three sudo commands in a row, you don't have to type the sudo
password three times. Another good example is that the path of executables
(things found in locations in `$PATH`) are stored in a cache, so their location
doesn't have to be looked up every time they are executed. If the location of
an executable changes, that cache needs to be refreshed.

So I wondered if the available space was also stored in a cache file somewhere.
I exit and re-enter my ssh session. I wait a few minutes. No luck. I'm not even
sure how to Google for this situation.

Then I remember something my old boss Andy said one time on the phone to someone
else:

> Yeah, the machine is out inodes. Can you add another disk?

Oh yes! inodes are a thing! I don't _really_ know what an inode is at this
moment, but it has something to do with the number of files or the number of
open files? I don't really care right now. I need to finish diagnosing and
hotfix this so I can get on my flight. I quickly Google how to investigate this.
`df -i`. Viola! 100% usage. 5.2 million of them, all used up. Does that mean I
have 5 million files on this machine? Is that normal? I have no idea.
I don't care.

Ok, so I need to delete some files. Where are all these files? A hunch says
they're in the `tmp` directory. Where else could there be a buildup of orphan
files? This service has been running for more than a year without running out
of inodes, so it must be tmp files.

```bash
ls /tmp
```

...

`ls` hangs forever. You won't even let me look at what's inside you? Smells
like guilt. I'm panicking a little now, because I'm blind without `ls`. Combine
that with having to type out every character instead of relying on tab completion,
and I'm not feeling so great.

Ok, hail mary time: `rm -rf /tmp/*`. I should just be able to delete everything
in here right? I know this is a bad idea because many services store
essential pieces of information in tmp files for their runtime. And this is
`/tmp`, so literally any system service could go down without its tmp files.
But I'm willing to take that risk. System services should only store, well,
temporary data in `/tmp`, so a restart or machine reboot should resolve any
issues with that. Worst case scenario, spin up a new VM, provision it and
deploy my app with a fresh database dump in ~1hr.

Luckily, `rm` hangs and eventually exits with a message "too many arguments".

Oh ok, so at least that confirms there are a ton of files in `/tmp`. I also
make a mental "cool!" note that `rm -f /tmp/*` looks like it's expanding each
file in `/tmp` and passing them as individual arguments to `rm`. Is that what
the splat operator does? I know that it does something similar in Ruby.

Ok, so what now? I can't delete files all together and I can't see how many
files are in there. But I _really_ want to see what's in `/tmp` before going
any further. I remember that I have aliased `ls` to `ls -al` on this VM. I
wonder if removing the arguments will help get some output. Google says I can
run `\ls` to avoid the alias and run the program directly. `/bin/ls` would also
do the same. Viola again! I have output, but it is taking a long time to print
out. Hundreds of hundreds of lines of output. Filenames of garbled letters and
numbers. This smells like `Dir.mktmpdir`. I know I'm doing this in app code
somewhere. Looks like it isn't getting cleaned up. It is probably part of the
cache warming code.

I cancel out of the still-streaming output of `ls`. Clearly I need to run `rm`
on each of these individually. What's the fastest way for me to do this?
I KNOW! I'll send the output of `ls` to a file, open it in `vim` and substitute
a `rm -rf ` at the beginning of every line! Oh wait, I can't create files on
this machine. Ok, I'll just remove a few files manually by copy pasting into the
terminal, open up a few inodes and create a single file. But vim is so
slow on this machine right now. I know! I'll `scp` this file over to my local
machine, add the `rm -rf ` prefixes there and then paste the whole file back
into my ssh session! Oh shit, the output of `ls` shows ~4.5 million files in
`/tmp`. This could take a while.

I shut off all the other services on the VM and let 4.5 million lines of
`rm -rf` run uninterrupted for the next 30 minutes. The nice thing is that each
line runs individually, so all I have to do to stop deleting files is to close
my Terminal tab.

To monitor my inode situation and feel cool at the same time, I ssh into the
same machine and run

```bash
while true; do df -i; sleep 1; done
```

Surely enough, they're going down! I feel happy.

When the inodes usage gets down to 70%, I turn off my `rm -rf` rager, turn off
my cache warmers, and restart my web server. We're back online and downloads
should be stable.

I also `mv /tmp /tmp-bak; sudo mkdir /tmp; sudo chmod 1777 /tmp` to create an
empty `/tmp` dir with the same octal mode for permissions. I'm not sure this is
necessary, and it doesn't help the disk space or inode situation, but I know I
want `/tmp` to start from a blank slate. If I can't reset `/tmp` entirely
right now, I can at least swap it out for a new directory.

What a day.

In summary, the way to debug something when you're all out of ideas is to
remember what your boss said 2 years ago.

The lesson I learned was to avoid managing my own VMs and to
[hug a devops person today](https://twitter.com/hashtag/hugops?lang=en).
