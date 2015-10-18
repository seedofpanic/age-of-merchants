angular.module('Tools', [])
.controller('TabsCtrl', ($scope) ->
  that = @
  that.open = (tab, url) ->
    that.currentTab = tab
    that.url = url
  return
)