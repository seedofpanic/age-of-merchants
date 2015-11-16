angular.module('Users', [])
.controller "UsersCtrl", ($http) ->
  that = @
  that.pages = 0
  that.getPages = () ->
    new Array(that.pages)
  that.get = (page) ->
    that.loading = true
    page = page || 0
    $http.get 'api/users', {params: {page: page}}
    .then (res) ->
      that.users = res.data.users
      that.pages = res.data.pages
      that.current_page = page
      that.loading = false
  that.get()
  return