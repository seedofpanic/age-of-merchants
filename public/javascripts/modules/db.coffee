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
    profile_name = $route.current.params.profile_name
    buildings.arr = {}
    $http.get('/api/buildings?profile_name=' + profile_name).then( (res) ->
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
  get = (profile_name) ->
    if (profile_name)
      $http.get('/api/profile?name=' + profile_name).then((res) ->
        angular.copy(res.data, profile)
        profile.update = () ->
          get($route.current.params.profile_name)
      )
  get($route.current.params.profile_name)

  $rootScope.$on('$routeChangeSuccess', (scope, next, current) ->
    get(next.params.profile_name)
  )
  profile
)
