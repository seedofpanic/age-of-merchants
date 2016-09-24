angular.module('Users', [])
.factory 'SendTo', () ->
  user: null
.controller "UsersCtrl", ($http, $scope, Modals, SendTo) ->
  that = @
  $scope.pages = 0

  that.showNewDialog = (user) ->
    SendTo.user = user
    Modals.show('new_dialog', $scope)

  get = (page, old_page) ->
    console.log page
    console.log old_page
    if page==old_page
      return
    that.loading = true
    page = page || 0
    $http.get 'api/users', {params: {page: page}}
    .then (res) ->
      that.users = res.data.users
      $scope.pages = res.data.pages
      $scope.current_page = res.data.page
      that.loading = false
  $scope.current_page = 0
  $scope.$watch () ->
    $scope.current_page
  , get

  get(0)

  return
.controller "NewDialogCtrl", (SendTo, $element, $http) ->
  that = @
  that.send_to = SendTo.user
  that.message = ''
  that.result = null
  that.send = () ->
    if (that.message.length > 0)
      $http.post '/api/dialogs/message/send',
        send_to: that.send_to.id
        message: that.message
      .then (res) ->
        $element.modal('hide')
  return