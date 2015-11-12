angular.module('Tools', ['ngRoute', 'DropdownModule'])
.factory('Loc', ($rootScope, $http, $cookies) ->
  set: (lang) ->
    $http.get('/locales/' + lang).then(
      (res) ->
        $rootScope.lang = lang
        $rootScope.loc = res.data
        $cookies.put('lang', lang)
      () ->
    )
)
.run((Loc, $cookies, $rootScope)->
  $rootScope.c = (str) ->
    return $rootScope.$eval(str)
  $rootScope.keys = Object.keys
  Loc.set($cookies.get('lang') || 'en')
)
.directive('tabs', ['$route', ($route) ->
  restrict: 'C'
  link: (scope, element, attrs) ->
    param_id = attrs.param || 'tab';
    scope.tab = $route.current.params[param_id]
    scope.openTab = (tab) ->
      param = {}
      param[param_id] = tab
      $route.updateParams(param)
      scope.tab = tab
      return
    if !scope.tab && attrs.active
      scope.openTab(attrs.active)
    return
])
.directive('language', (Loc) ->
  restrict: 'C'
  require: '?ngModel'
  link: (scope, element, attrs, ngModel) ->
    ngModel.$viewChangeListeners.push(() ->
      Loc.set(ngModel.$viewValue)
    )
)
.factory('Modals', ($http, $compile) ->
  modals = {}
  show: (id, scope, onApprove)->
    if modals[id]
      modals[id].remove()
    $http.get('/partials/modals/' + id + '.html').then((res) ->
      modals[id] = $(res.data).appendTo('body')
      modals[id].modal(
        onApprove: onApprove
        selector:
          close: '.close'
          approve: '.approve'
        allowMultiple: true
      ).modal('show')
      $compile(modals[id])(scope)
    )
    return
)