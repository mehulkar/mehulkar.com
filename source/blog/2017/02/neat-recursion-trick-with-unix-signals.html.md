---
title: Neat Recursion Trick with UNIX Signals
date: 2017-02-08
categories: programming, python
---

I learned a neat little trick to do recursion with UNIX signals
that I probably wouldn't have thought of myself.

Let's look at a `script.py` that looks like this:

```python
import signal
import time

class MyClass:
  def main(signum=None, frame=None):
    # bind this function as a callback to SIGALARM
    signal.signal(signal.SIGALRM, self.main)

    # send a SIGALARM in 10 seconds
    signal.alarm(10)


if __name__ == "__main__":
  # kick it off
  MyClass().main()

  # keep alive
  while True:
    time.sleep(10)
```

Let's break it down:

```python
if __name__ == '__main__':
  # kick it off
  MyClass().main()

  # keep alive
  while True:
    time.sleep(10)
```

Here we call the MyClass().main() function and then start an
infinite loop with a `while True` loop. This is just a dumb
way to keep the `python script.py` process alive forever.

```python
class MyClass():
  def main(signum=None, frame=None):
    # bind this function as a callback to SIGALARM
    signal.signal(signal.SIGALRM, self.main)

    # send a SIGALARM in 10 seconds
    signal.alarm(10)
```

The `main` function here does 2 things:

1. Binds `self.main` as a callback to `SIGALARM`. This means
   that if a `SIGALARM` is received by the current process, it should
   call `self.main()`.
1. Sends `SIGALARM` to the current process in 10 seconds.

The combination of these two lines mean that every 10 seconds
the `main()` function of the same `MyClass()` instance will
be called.

You could probably ask why a UNIX signal is being used to trigger
the call to `main()` again, and why we couldn't just call the
function again. One interesting application of this technique is that by
using UNIX signals, we can trigger this recursion from other processes as well.
Specifically, a use case would be to trigger the recursion from a child
or forked process that knows about its parent.

For example, in `MyClass().main()`, if we were to create a subprocess
that runs `python child.py` like this:

```python
import time
import signal
import subprocess
def main():
  signal.signal(signal.SIGALRM, self.main)

  ## create subprocess
  subprocess.call(['python', 'child.py'])

  signal.alarm(10)

if __name__ == '__main__':
  MyClass().main()
  while True:
    time.sleep(10)
```

and if this is what `child.py` looks like:

```python
import os
import signal

def child():
  print("I'm the child!")

  """
    Do some work here
  """

  # Send SIGALARM to the parent PID
  os.kill(os.getppid(), signal.SIGALRM)

if __name__ == '__main__':
  child()
```

When `child()` runs, it does some work and then sends `SIGALARM`
to its parent PID. This signal is sent to the `python script.py`
process and is handled by the callback we attached in `MyClass().main()`,
calling `MyClass().main()` again.

So this trick opens up some interesting possibilities in asynchronous
programming with multiple processes.

I'm not sure how contrived this example is--at least a little bit--
but I thought it was a clever implementation.

Enjoy!
