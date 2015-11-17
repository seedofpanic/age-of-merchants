angular.module 'User', ['ngRoute']
.controller 'UserCtrl', ($route, $http) ->
  that = @
  that.getTemplate = () ->
    'partials/user/' + ($route.current.params['tab'] || 'personal_data') + '.html'
  $http.get '/api/user/profile'
  .then (res) ->
    that.user = res.data
  return
.controller 'DialogsCtrl', ($http) ->
  that = @
  that.refresh = () ->
    $http.get '/api/dialogs'
    .then (res) ->
      that.dialogs = {}
      $.each res.data, () ->
        unless that.dialogs[@.dialog_id]
          that.dialogs[@.dialog_id] = {users: [], new: 0}
        @.user.new = @.new
        that.dialogs[@.dialog_id].users.push(@.user)
        that.dialogs[@.dialog_id].new += @.new
  that.refresh()
  return