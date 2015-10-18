angular.module('Buildings', [])
.controller('BuildingsCtrl', ($scope, $http) ->
  that = @
  $http.get('/api/buildings', (buildings) ->
    that.buildings = buildings
  )
  return
)