angular.module('Tools', ['ngRoute'])
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
  Loc.set($cookies.get('lang') || 'en')
)
.directive('tabs', ['$route', ($route) ->
  restrict: 'C'
  link: (scope) ->
    scope.tab = $route.current.params.tab
    scope.openTab = (tab) ->
      $route.updateParams(tab: tab)
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
    unless modals[id]
      $http.get('/partials/modals/' + id + '.html').then((res) ->
        modals[id] = $(res.data).appendTo('body')
        modals[id].modal(
          onApprove: onApprove
          selector:
            close: '.close'
            approve: '.approve'
        ).modal('show')
        $compile(modals[id])(scope)
      )
    else
      modals[id].modal('show')
)