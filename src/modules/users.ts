angular.module('Users', [])
.factory('SendTo', SendTo)
.controller("UsersCtrl", UsersCtrl)
.controller("NewDialogCtrl", NewDialogCtrl);

function SendTo() {
  return {user: null};
}

UsersCtrl.$inject = ['$http', '$scope', 'Modals', 'SendTo'];

function UsersCtrl($http, $scope, Modals, SendTo) {
  var that = this;
  $scope.pages = 0;

  that.showNewDialog = function (user) {
    SendTo.user = user;
    Modals.show('new_dialog', $scope);
  };

  const get = function (page, old_page?) {
    if (page == old_page) {
      return;
    }
    that.loading = true;
    page = page || 0;
    $http.get('api/users', {params: {page: page}})
      .then(function (res) {
        that.users = res.data.users;
        $scope.pages = res.data.pages;
        $scope.current_page = res.data.page;
        that.loading = false;
      });
  };

  $scope.current_page = 0;
  $scope.$watch('current_page', get);

  get(0);
}

NewDialogCtrl.$inject = ['SendTo', '$element', '$http'];

function NewDialogCtrl(SendTo, $element, $http) {
  var that = this;
  that.send_to = SendTo.user;
  that.message = '';
  that.result = null;
  that.send = function () {
    if (that.message.length > 0)
      $http.post('/api/dialogs/message/send',
        {
          send_to: that.send_to.id,
          message: that.message
        })
        .then(function (res) {
          $element.modal('hide')
        });
  }
}