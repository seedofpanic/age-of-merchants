angular.module('DB', [])
.factory('Regions', ($http) ->
  regions = {}
  $http.get('/api/regions').then((res) ->
    $.each res.data, () ->
      regions[@.id] = @
  )
  regions
)
.factory('ProfileBuildings', ($http, $route) ->
  buildings = arr: {}
  buildings.get = () ->
    profile_id = $route.current.params.profile_id
    buildings.arr = {}
    $http.get('/api/buildings?profile_id=' + profile_id).then( (res) ->
      $.each res.data, () ->
        buildings.arr[@.id] = @
      buildings.length = res.data.length
    )
    buildings.push = (building) ->
      buildings.arr[building.id] = building
      buildings.length++
  buildings
)
.factory('Profile', ($http, $route, $rootScope) ->
  profile = {}
  get = (profile_id) ->
    if (profile_id)
      $http.get('/api/profile?id=' + profile_id).then((res) ->
        angular.copy(res.data, profile)
        profile.update = () ->
          get($route.current.params.profile_id)
      )
  get($route.current.params.profile_id)

  $rootScope.$on('$routeChangeSuccess', (scope, next, current) ->
    get(next.params.profile_id)
  )
  profile
)
