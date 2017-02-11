---
title: 3 years of API development
date: 2016-03-07
categories: programming
---

I've been writing HTTP APIs for the past 2-3 years---most of my professional life
as a software developer---and these are some things I feel strongly about (in
no particular order).

## Write the spec first

This does not mean write the entire API spec upfront.

If you're using an Agile approach and have a user story in mind, or if you have
a feature in mind, design a spec first. Assuming there are consumers of this API
already, propose the spec and flush it out with team members completely before
implementing. This process will:

1. illuminate implementation difficulties, road blocks, and potential shortcuts
2. allow consumers of the API to mock out the proposed design, making it
easier to parallelize team workload

## Do not autogenerate documentation

Auto generated documentation works like this:

A DSL gathers data about endpoints and annotates them with metadata
that is provided inline with the code. This poses one of two problems:

1. The metadata content becomes too intense/lengthy making the code difficult
to read. This is bad because documentation is for consumers and code is
for developers. Inline docs are noise and noisy code will take longer to debug.
1. The metadata DSL is not flexible enough to let developers document
the intention and behavior of each endpoint. Intention and behavior cannot be
captured entirely without some amount of prose. Also, an API that documents
intention is more likely to be used responsibly.

An additional reason not to auto generate documentation is that every
breaking change to the API becomes forcibly accompanied by a documentation
change, which should trigger scrutiny (or at least attention) among
team members.

## Keep the surface area ruthlessly small

Two things are really easy:

1. Adding data into an existing endpoint
1. Adding endpoints

Both should be treated with the _highest_ level of scrutiny. Increase that
level of scrutiny with the number of consumers of the API.

Smaller surface area translates to fewer product promises, which translates
to less responsibility, which opens up a larger number of opportunities to
exceed expectations and delight customers.

## The API is not the database

A first-class API will inevitably never remain a set of endpoints that
serialize database table rows. Keep that in mind even when the API is
young.

An API is the mechanism by which consumers interact with your service.
That interaction requires just as much UX thought as any visual interface.
Making decisions about what to expose and how to it should be designed
carefully and intentionally.

## Remember to handle legacy data

Remember, the API is not the database.

As decision-makers, developers, and users enter and leave the system
you are working on, data validations and constraints will change. Changes to
constraints will not always be obvious at implementation time.

A dedicated QA person to bash against the API is a really good
(albeit expensive) solution. Automated tests are a good solution.
Acquiring dumps of dummy data is also useful.

## Start with a standard

Start with a standard like JSON API or GraphQL or REST or invent your own.
You will probably diverge from it, but starting ad-hoc will cause intense
developer and consumer fatigue. Standards are just established patterns
and it makes it easier to form expectations and conversely, easily label
divergences from the pattern.

## Think about authentication and authorization early

The level of complexity in authentication and authorization can vary
depending on the goals of the API. Sooner or later, you will run into these
challenges:

1. Making requests from a CI system for performance and unit/integration testing
1. Make requests as a real consumer to debug/reproduce issues
1. Server to server requests

Think about how your API will function for each of these use cases
early, because they are fundamental building blocks of the system
and will be difficult to change / implement in the future.


---

Listicle sytle posts are so hard to sign off from, but this is the
end, in case you were wondering.
