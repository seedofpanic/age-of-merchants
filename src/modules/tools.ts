const modalsTemplates = {
  'field_buildings': require('./../../jade/modals/field_buildings.jade')(),
  'import': require('./../../jade/modals/import.jade')(),
  'move_troop': require('./../../jade/modals/move_troop.jade')(),
  'new_dialog': require('./../../jade/modals/new_dialog.jade')(),
  'order_product': require('./../../jade/modals/order_product.jade')(),
  'start_export': require('./../../jade/modals/start_export.jade')(),
  'stop_export': require('./../../jade/modals/stop_export.jade')(),
  'troops_neighbors': require('./../../jade/modals/troops_neighbors.jade')()
};

const pagingTemplate = require('./../../jade/tools/paging.jade');

angular.module('Tools', ['ngRoute', 'DropdownModule'])
  .factory('Loc', Loc)
  .run(run)
  .directive('tabs', tabs)
  .directive('language', language)
  .directive('paging', paging);

Loc.$inject = ['$rootScope', '$http', '$cookies'];

function Loc($rootScope, $http, $cookies) {
  return {
    set: function (lang) {
      $http.get('/locales/' + lang)
        .then(function (res) {
          $rootScope.locales = [
            {id: 'en', name: 'English'},
            {id: 'ru', name: 'Русский'}
          ];
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
      var param_id = attrs.param || 'tab';
      scope.tab = $route.current.params[param_id];
      scope.openTab = function (tab) {
        var param = {};
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

function paging() {
  return {
    restrict: 'A',
    replace: true,
    template: pagingTemplate,
    link: function (scope) {
      scope.getPages = function (pages) {
        new Array(pages);
      };
    }
  };
}

