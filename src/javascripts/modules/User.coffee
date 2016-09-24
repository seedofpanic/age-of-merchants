angular.module 'User', ['ngRoute']
.controller 'UserCtrl', ($route, $http) ->
  that = @
  that.getTemplate = () ->
    'partials/user/' + ($route.current.params['tab'] || 'personal_data') + '.html'
  $http.get '/api/user/profile'
  .then (res) ->
    that.user = res.data
  return
.controller 'DialogsCtrl', ($route, $http, $scope) ->
  that = @
  that.dialogs = {}
  that.new_msg = ''
  that.deselect = () ->
    $scope.selected = null
    $route.updateParams(dialog_id: null)
    that.refresh()
  that.show = (dialog) ->
    $route.updateParams(dialog_id: dialog.id)
    that.messages = null
    $scope.selected = dialog
    $http.get '/api/dialogs/messages?dialog_id=' + dialog.id
    .then (res) ->
      that.messages = res.data
  that.send = () ->
    that.loading = true
    $http.post '/api/dialogs/message/send',
      send_to: $scope.selected.users[0].id
      message: that.new_msg
    .then (res) ->
      that.messages.push(
        msg: that.new_msg
        user: $scope.user
      )
      that.new_msg = ''
      that.loading = false
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
        that.dialogs[@.dialog_id].last = @.last
        that.dialogs[@.dialog_id].id = @.dialog_id
  if ($route.current.params.dialog_id > 0)
    that.show(id: $route.current.params.dialog_id)
  else
    that.refresh()
  return