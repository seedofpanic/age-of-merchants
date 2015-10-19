angular.module('Tools', ['ngRoute'])
.directive('tabs', ['$route', ($route) ->
  restrict: 'C'
  link: (scope) ->
    scope.tab = $route.current.params.tab
    scope.openTab = (tab) ->
      $route.updateParams(tab: tab)
      return
])