angular.module('Tools', ['ngRoute', 'DropdownModule'])
  .factory('Loc', Loc)
  .run(run)
  .directive('tabs', tabs)
  .directive('language', language)
  .factory('Modals', Modals)
  .directive('paging', paging);

Loc.$inject = ['$rootScope', '$http', '$cookies'];

function Loc($rootScope, $http, $cookies) {
  return {
    set: function (lang) {
      $http.get('/locales/' + lang)
        .then(function (res) {
          $rootScope.lang = lang;
          $rootScope.loc = res.data;
          $cookies.put('lang', lang);
        });
    }
  }
}

run.$inject = ['Loc', '$cookies', '$rootScope', '$http'];

function run(Loc, $cookies, $rootScope, $http) {
  $rootScope.c = function (str) {
    return $rootScope.$eval(str);
  };
  $rootScope.keys = Object.keys;
  Loc.set($cookies.get('lang') || 'en');
  $rootScope.getNewMsgs = function () {
    $http.get('/api/dialogs/new')
      .then(function (res) {
        $rootScope.new_messages = res.data;
      });
    setTimeout($rootScope.getNewMsgs, 10000);
  };
  $rootScope.getNewMsgs();
}

tabs.$inject = ['$route'];

function tabs($route) {
  return {
    restrict: 'C',
    link: function (scope, element, attrs) {
      param_id = attrs.param || 'tab';
      scope.tab = $route.current.params[param_id]
      scope.openTab = function (tab) {
        param = {};
        param[param_id] = tab;
        $route.updateParams(param);
        scope.tab = tab;
      };
      if (!scope.tab && attrs.active) {
        scope.openTab(attrs.active);
      }
    }
  }
}

language.$inject = ['Loc'];

function language(Loc) {
  return {
    restrict: 'C',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$viewChangeListeners.push(function () {
        Loc.set(ngModel.$viewValue);
      })
    }
  }
}

Modals.$inject = ['$http', '$compile'];

function Modals($http, $compile) {
  var modals = {};
  return {
    show: function (id, scope, onApprove, onHidden) {
      if (modals[id]) {
        modals[id].remove();
      }
      $http.get('/partials/modals/' + id + '.html').then(function (res) {
        modals[id] = $(res.data).appendTo('body');
        modals[id].modal({
          onApprove: onApprove,
          onHidden: onHidden,
          selector: {
            close: '.close',
            approve: '.approve'
          },
          allowMultiple: true
        }).modal('show');
        $compile(modals[id])(scope);
      });
    }
  }
}

function paging() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/tools/paging.html',
    link: function (scope) {
      scope.getPages = function (pages) {
        new Array(pages);
      };
    }
  };
}

