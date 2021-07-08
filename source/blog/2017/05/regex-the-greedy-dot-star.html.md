---
title: "Regex: The Greedy Dot Star"
date: 2017-05-19
categories: programming, ruby
---

I was recently extending [`redcarpet`][1] (a Markdown rendering library) to
render a `CHANGELOG.md` in a nicer way. The idea is that markdown like this:

```md
-   [fixed] that one bug
-   [added] that one feature
-   [removed] that other thing
-   this one doesn't have a tag
```

turns into this HTML:

```html
<li><span class="fixed tag">fixed</span> that one bug</li>
<li><span class="added tag">added</span> that one feature</li>
<li><span class="removed tag">removed</span> that other thing</li>
<li>this one doesn't have a tag</li>
```

Notice that the main transformation is the "tag" inside square brackets
is turned into a `span` element with a class of the same name.

Extending the rendering of list elements in `redcarpet` specifically involves
overwriting a method that looks like this<sup>1</sup>:

```ruby
def list_item(text)
end
```

The `text` argument in the method signature is a single list item,
stripped of the identifier (in this case "-"). So, inside this method,
I have to parse `[fixed] that one bug` and turn it into my desired HTML.

## First Regex Approach

My first regex approach was to capture everything inside `[]`, and use the
captured group to create the span tag. This seemed straightforward:

```ruby
def list_item(text)
  matched = text.match(/^\\[(.*)\\] (.*)$/)
  tag_type = matched[1]
  note = matched[2]

  "<li><span class=#{tag_type} tag>#{tag_type}</span>#{note}</li>"
end
```

The important part of this regex is `\\[(.*)\\]`<sup>2</sup>.

-   The double backslashed `[` and `]` characters match literal square brackets
    in my string
-   The `(.*)` between the square bracket literals match ALL characters inside
    the square brackets

The second part of the regex `(.*)` simply captures the rest of the string in
another capture group that we can assign to the `note` variable.

(I've omitted the handling of list items that _don't_ contain square brackets
for the sake of simplicity.)

## The Edge Case

This solution worked pretty well, but I ran into an issue. When I attempted to
render a list item that contained a _second_ pair of `[]` literals, the HTML
output was all messed up.

For example, this markdown:

```markdown
-   [fixed] [something] happened here
```

SHOULD be rendered as:

```html
<span class="fixed tag">[something] happened here</span>
```

But instead, I was getting:

```html
<li>
    <em class="fixed] [something tag">fixed] [something</em>
    <span>happened here</span>
</li>
```

At first glance, this looked like garbage text to me, but then I realized that
the first capture group of my regex, between the `[]` literals, was capturing
from the _first_ `[` to the _last_ `]` in the input string.

So, my first capture group was capturing: `fixed] [something` instead of
just `fixed`.

This was strange to me, because I assumed that the `.*` in `\\[(.*)\\]`
would capture UNTIL it reached the first `]`.

But it turns out that the `.*` is "greedy". That means that that it will match
all characters to the end of the entire string, and then work backwards to find
the next match for the remaining regex.

To break it down.. here's what happens:

1. `\\[` finds the first literal open square bracket
1. `(.*)` captures the rest of the string
1. `\\]` starts at the end of the string and goes backwards one character at a
   time until it finds a literal close square bracket.
1. ` (.*)` takes the remaining string after that closing square bracket and
   captures that in a group.

So in step 3, the _wrong_ square bracket is found :(.

## Solution

There are two ways to fix this:

### Make `.*` NOT greedy

The first way is to change the behavior of `.*` so that it doesn't gobble up
the entire string, like the greedy monster it is. So I can change the regex
matcher to:

```
\\[(.*?)\\]
```

Notice the extra `?`.

Although this works, the way this Regex _has_ to work now is instead of capturing
a bunch of the string, it has go character by character until it finds the
next closing `]` literal. This makes the regex a lot slower. Since I was rendering
user submitted `CHANGELOG.md` files, I didn't want to rely on the size of user
text being small.

### Exclude `[]` literals from the first `.*`

Another solution is to _exclude_ `[]` literal square brackets from the first
`(.*)` capture group:

```
\\[([^\\[\\]]*)\\]
```

This looks confusing to read, but if you break it down, it makes sense:

1. `\\[` marks the opening literal square bracket
2. `(` marks the beginning of the capture group
3. `[` marks the beginning of a list
4. `^` means NOT
5. `\\[\\]` are again the literal square bracket characters
6. `]` is the end of the list
7. `*` means any number of characters
8. `)` marks the end of the capture group
9. `\\]` marks the ending literal square bracket

Numbers 2-8 in this list are the replacements for a `(.*)` and mean "capture
0 or more characters that are not literal square brackets in a group".

So now, my regex will match my "tag" after the first open square bracket until
the first closing square bracket.

The final regex is:

```
^\\[([^\\[\\]]*)\\] (.*)$
```

Note that this will still break in some (many) cases, but I'm not addressing
those here.

## Links

Here's some links with the regex explained here:

-   [Wrong](https://regex101.com/r/fPar5s/1)
-   [Correct](https://regex101.com/r/hyPOEr/2)

**Footnotes**

1. I've omitted the second argument that allows handling of ordered and unordered
   lists for simplification.
2. I'm not entirely clear in regex land when double backslashes are needed for
   escaping and when a single backslash will do. For example, the regex101 links
   at the bottom of this article have regexes with only single backslashes
   for escaping.

[1]: https://github.com/vmg/redcarpet
