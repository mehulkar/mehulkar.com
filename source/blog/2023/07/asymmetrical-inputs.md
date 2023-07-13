---
title: Asymmetrical Inputs
date: 2023-07-13
tags: programming, ux
---

A few months ago I made a small app to input some data into a form and record it
in some backend. (The details don’t really matter, so I'm leaving them out.) One
of the controls in this form is a number input. Since is was a mobile app I
wanted the input to be easy and quick to change. Mobile keyboards, at least on
iOS, are pretty bad to use quickly because they take a long time to open. So
instead of making an input that you could only select and type a number into, I
wanted buttons that could increment and decrement the value.

In one case, I was recording a time duration in minutes. I didn’t care about
being more accurate than to the nearest 10 minutes, so I added a default value
of 0, and two buttons that added and subtracted 10 to the value respectively.
This worked to a certain extent, and I was right that actually typing in a value
was pretty much never used. But soon it became clear that I actually want to be
accurate to the nearest 5 minutes instead.

At first, I changed my code to increment and decrement by 5 mins. This was fine
and worked, but I eventually realized that *every* use had now doubled the
number of interactions to get to the same number. Four taps to enter 20 mins
(previously two), 12 taps for 60 mins (previously 6), and so on.

I don’t know where the inspiration came from, but I realized I could fulfill my
accuracy requirement by only changing the decrement button to 5 mins, and
keeping the increment button to 10 mins. The result was that in an evenly
distributed range of inputs, *half* my inputs were back to the original number
of taps. That is to say, entering 20 mins again took two taps and 60 mins took
six taps. 65 mins, on the other hand, took 7 taps, instead of 13 (up 6, down 1).

I was really happy with this design, and it got me thinking about why this felt
unintuitive, and yet clever at the end. I think it's because I had an
internalized expectation of symmetry — that a "down" button does the same thing
as the "up" button, but in the opposite direction. We see this pattern pretty
commonly (with volume controls, for example), and it generally seems like
symmetry is a good idea. But it got me thinking, where else is asymmetry
actually more usable?
