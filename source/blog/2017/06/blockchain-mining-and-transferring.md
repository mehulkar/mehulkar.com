---
title: Blockchain Mining and Transferring
date: 2017-06-14
categories: til
---

I vaguely knew things about Bitcoin and blockchian technology, but a lot of
things became clearer today. My original question today was:

> How does 'mining' (a verb) turn into a
'coin' or 'token' (a noun and a measure of value)?

I understand that "mining" means solving an algorithm by guessing
answers to a math problem. More on that later. But once you solve this math
problem in this virtual setting, how do you suddenly have a "bitcoin"?
And how does that relate to buying and selling this value with US Dollars?

Previously, I thought that mining *new* bitcoin was a fundamentally different
operation from *transferring* existing bitcoin. But it turns out that is not the
case.

Imagine a shared, public notebook. When you "mine" a new block (by guessing a
solution to the math problem), you get the privilege
of writing in this notebook. So you write down:

> I just earned 12.5 bitcoin!


Since you earned this privilege, everyone basically just agrees to what you
write down.

**Note:** "12.5" is predetermined. It is a property of the blockchain itself
and halves every 4 years. So 8 years ago, you could write down "I own 50 bitcoin".

So now "miners" are continuously earning the privilege to earn "bitcoin".
In fact, they first 169 "blocks" that were mined were literally just these
proclamations.

So now what do you do with these bitcoins?

Well, same thing you do with other currency! You pay for goods and services. Or,
in other words, you *transfer* them to other people who want them.

Now, we know that there is one true chain of transactions on the blockchain and
we know that only "miners" (so far) are the only ones who are adding to this
chain. So how do arbitrary transactions between players in the market get
recorded in this chain?

I'm unclear on this part, but it looks like when a transaction is initiated, it
sits in a pool somewhere. "Miners" come along and grab a set of transactions
and attempt to write it into the public notebook. As a *reward* for doing this
writing, they tack on another line into the notebook claiming that they now have
another 12.5 coins. Miners are rewarded 1 transaction of 12.5 bitcoin for each
"block" of transactions they mine.

**Note**: writing these transactions involves some validation to ensure that
the sender actually holds the bitcoin they are sending. More on that in a
different post.

The revelation for me here was making this connection between miners and other
holders of bitcoin, but I have several open questions right now:

1. What and where is this pool of transactions that miners can grab from?
1. If two miners grab overlapping sets of transactions to write to the ledger,
how does that get resolved? If race conditions are so inherently built into to
the system, the solution must _also_ be built into the system.
1. It looks like miners are directly incentivized to grab as few transactions as
possible (because then their rate of reward is 12.5 bitcoin per block). Is there
a minimum block size to regulate this? Or are all miners just aware that in the
long term, more transactions is better for the ecosystem? The latter seems fragile.

The actual act of "mining" is interesting also, but I will leave that in its
black box for now.

