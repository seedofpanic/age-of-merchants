angular.module('Office', ['ngRoute'])
.controller('OfficeCtrl', ['$http', '$route', '$location', ($http, $route, $location) ->
  that = @
  that.loaded = true
  that.new_profile_name = ''
  that.profile_name = $route.current.params.profile_name
  that.profiles = []
  unless that.profile_name
    $http.get('/api/profiles').then((res) ->
      that.profiles = res.data
    )
  else
    $http.get('/api/profile?name=' + that.profile_name).then((res) ->
      that.profile = res.data
    )
  that.deselect = () ->
    $location.path('office')
  that.newProfile = () ->
    if that.new_profile_name.length > 0
      $http.post('/api/profile/new', name: that.new_profile_name)
      .then( (res) ->
        that.profiles.push(res.data)
      , () ->

      )
  that.selectProfile = (profile) ->
    $route.updateParams(profile_name: profile.name);
  return
])