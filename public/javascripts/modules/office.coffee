angular.module('Office', ['ngRoute'])
.controller('OfficeCtrl', ($http, $route, $location, Profile, ProfileBuildings) ->
  that = @
  that.loaded = true
  that.new_profile_name = ''
  that.profile_name = $route.current.params.profile_name
  that.profiles = []
  unless that.profile_name
    $http.get('/api/profiles').then((res) ->
      that.profiles = res.data
    )
  that.profile = Profile
  that.deselect = () ->
    $location.path('office')
  that.newProfile = () ->
    that.err = null
    if that.new_profile_name.length > 0
      $http.post('/api/profile/new', name: that.new_profile_name)
      .then( (res) ->
        that.profiles.push(res.data)
      , (res) ->
        that.err = res.data
      )

  that.selectProfile = (profile) ->
    $route.updateParams(profile_name: profile.name);
  return
)
.factory 'OrderTroop', () ->
  troop: {}
.factory 'NeighborTroop', () ->
  troop: {}
.controller 'TroopsCtrl', ($http, $route, Regions, $scope, OrderTroop, Modals, NeighborTroop) ->
  that = @
  that.regions = Regions
  that.profile_name = $route.current.params.profile_name
  $http.get '/api/troops?profile_name=' + that.profile_name
  .then (res) ->
    that.troops = res.data
  that.stopTroop = (troop) ->
    $http.post '/api/troop/stop', {troop_id: troop.id}
    .then () ->
      troop.move = undefined
  that.openMover = (troop) ->
    angular.copy(troop, OrderTroop.troop)
    OrderTroop.troop.move = {}
    OrderTroop.troop.move.field = {}
    angular.copy(troop.field, OrderTroop.troop.move.field)
    Modals.show 'move_troop', $scope, () ->
      $http.post 'api/troop/move', OrderTroop.troop
      .then (res) ->
        troop.move = res.data
  that.showNeighbors = (troop) ->
    NeighborTroop.troop = troop
    Modals.show 'troops_neighbors', $scope, () ->
      return
  return
.controller 'MoveTroopCtrl', (OrderTroop, Regions) ->
  that = @
  that.regions = Regions
  that.troop = OrderTroop.troop
  return
.controller 'NeighTroopsCtrl', (NeighborTroop, $http) ->
  that = @
  that.id = NeighborTroop.troop.id
  that.troops = []
  $http.get('api/troops/field', {params:
      field_id: NeighborTroop.troop.field.id
      troop_id: NeighborTroop.troop.id
  }).then (res) ->
    res.data.forEach (troop) ->
      troop.attack = troop.assaults.length > 0
      that.troops.push(troop);
      return
    return
  that.attack = (troop) ->
    if troop.attack
      $http.post('api/troops/attack', {target_id: troop.id, troop_id: that.id}).then () ->
        return
      , () ->
        troop.attack = false
    else
      $http.post('api/troops/stop_attack', {target_id: troop.id, troop_id: that.id}).then () ->
        return
      , () ->
        troop.attack = true
  return