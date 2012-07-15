App.favoritesController = Ember.ArrayController.create
  content: App.store.findAll(App.Favorite)