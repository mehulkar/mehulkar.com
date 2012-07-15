#= require_self
#= require_tree ./models
#= require_tree ./data_controllers
#= require_tree ./view_controllers
#= require_tree ./templates

window.App = Ember.Application.create

App.store = DS.Store.create
  revision: 4
  adapter: DS.RESTAdapter.create
    bulkcommit: false