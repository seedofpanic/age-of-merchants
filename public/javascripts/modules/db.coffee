angular.module('DB', [])
.factory('Regions', ($http) ->
  regions = {}
  $http.get('/api/regions').then((res) ->
    $.each res.data, () ->
      regions[@.id] = @
  )
  regions
)
