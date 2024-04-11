---
title: "Friday morning bootcamp blues (in Ruby)"
date: 2012-02-10
tags:
- programming
- ruby
---

```ruby
# Disclaimer: this is not TDD code.
##REFACTORED##

class Student
  def initialize(num)
    @energy_level = num
  end

  def will_do_yoga?
    tired? ? "Please do Yoga at home today" : "Go to Yoga"
  end

  def tired?
    @energy_level < 2
  end
end

######ORIGINAL######

class Mehul
  def initialize(num)
    @energy_level = num
  end

  def does_Yoga?
    if @tired == true
      return = "Please do Yoga at home today"
      exit                #go back to sleep
    else
      go_to_Yoga     #undefined method. i gave rspec a cookie to pass the test.
    end
  end

  def tired?
    @tired = true if @energy_level < 2
    @tired = false
  end
end

##########

#I ask myself on Friday morning: Mehul.new(1).does_Yoga?
```
