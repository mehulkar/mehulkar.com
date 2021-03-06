class Category

  ROUTE_MAP = {
    'three-musics' => 'threemusics',
    'ninja-tennis' => 'ninjatennis',
    'ember.js' => 'emberjs'
  }

  attr_reader :name

  def initialize(name)
    @name = name
  end

  def route_name
    ROUTE_MAP.fetch(name, name)
  end

  def route_path
    "#{route_name}_path"
  end
end
