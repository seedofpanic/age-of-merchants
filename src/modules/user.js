const tabsTemplates = {
    'dialogs': require('./../../jade/user/dialogs.jade'),
    'personalData': require('./../../jade/user/personal_data.jade')
};

angular.module('User', ['ngRoute'])
  .controller('UserCtrl', UserCtrl)
  .directive('userTabContents', userTabContents)
  .controller('DialogsCtrl', DialogsCtrl);

UserCtrl.$inject = ['$http'];

function UserCtrl($http) {
  var that = this;
  $http.get('/api/user/profile')
      .then(function (res) {
        that.user = res.data;
      });
}

userTabContents.$inject = ['$route'];

function userTabContents($route){
    return {
        restrict: 'A',
        template: function () {
            return tabsTemplates[$route.current.params['tab']] || tabsTemplates.personalData;
        }
    }
}

DialogsCtrl.$inject = ['$route', '$http', '$scope'];

function DialogsCtrl($route, $http, $scope) {
  var that = this;
  that.dialogs = {};
  that.new_msg = '';

  that.deselect = function () {
    $scope.selected = null;
    $route.updateParams({dialog_id: null});
    that.refresh();
  };

  that.show = function (dialog) {
    $route.updateParams({dialog_id: dialog.id});
    that.messages = null;
    $scope.selected = dialog;
    $http.get('/api/dialogs/messages?dialog_id=' + dialog.id)
        .then(function (res) {
          that.messages = res.data;
        });
  };

  that.send = function () {
    that.loading = true;
    $http.post('/api/dialogs/message/send',
        {
          send_to: $scope.selected.users[0].id,
          message: that.new_msg
        })
        .then(function (res) {
          that.messages.push({
            msg: that.new_msg,
            user: $scope.user
          })
          that.new_msg = '';
          that.loading = false;
        });
  };

  that.refresh = function () {
    $http.get('/api/dialogs')
        .then(function (res) {
          that.dialogs = {};
          $.each(res.data, function () {
            if (!that.dialogs[this.dialog_id]) {
              that.dialogs[this.dialog_id] = {users: [], new: 0};
            }
            this.user.new = this.new;
            that.dialogs[this.dialog_id].users.push(this.user);
            that.dialogs[this.dialog_id].new += this.new;
            that.dialogs[this.dialog_id].last = this.last;
            that.dialogs[this.dialog_id].id = this.dialog_id;
          });
        });
  };
  if ($route.current.params.dialog_id > 0) {
    that.show({id: $route.current.params.dialog_id});
  } else {
    that.refresh();
  }
}