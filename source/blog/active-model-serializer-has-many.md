---
title: "Active Model Serializers has_many association"
date:  2014-10-02 00:00:00
categories: programming, rails
---

I always forget all the different ways of serializing associations things, so putting down notes:

## has_many

```ruby
class AuthorSerializer < ActiveModel::Serializer
  has_many :posts
emd
```

This will embed a array of `post` records into the `author` record.

```json
{
  "authors": {
    "posts": []
  }
}
```

## has_many, embed :ids

```ruby
class AuthorSerializer < ActiveModel::Serializer
  has_many :posts, embed: :ids
emd
```

This will embed post_ids and sideload the posts:

```json
{
  "posts": [],
  "authors": {
    "post_ids": []
  }
}
```
## attribute

```ruby
class AuthorSerializer < ActiveModel::Serializer
  attributes :post_ids
emd
```

This will only embed the `post_ids`.

```json
{
  "authors": {
    "post_ids": []
  }
}
```
