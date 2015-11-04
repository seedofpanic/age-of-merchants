module = angular.module('DropdownModule', [])

dds = []

$(window).click(() ->
  dds.forEach((dd) ->
    if !dd.stopClick && dd.scope.droped
      dd.scope.search = ''
      dd.scope.droped = false
      dd.scope.$apply()
    dd.stopClick = false
    return
  )
)

module.directive('dropdown', () ->
  restrict: 'A'
  require: '?ngModel'
  transclude: true
  replace: true
  templateUrl: '/partial/admin/dropdown.html'
  link: (scope, element, attrs, model, transclude) ->
    firstChange = true

    scope.selected = {}
    scope.droped = false
    dd =
      stopClick: false
      scope: scope

    dds.push(dd)

    scope.toggle = () ->
      scope.droped = !scope.droped
      dd.stopClick = true
      scope.$apply()

    scope.show = () ->
      scope.droped = true
      dd.stopClick = true

    scope.hide = () ->
      scope.droped = false
      dd.stopClick = true

    if attrs.action == 'show'
      element.click(() ->
        scope.show()
      )
    else
      element.click(() ->
        scope.toggle()
      )



    scope.select = (data, element, event) ->
      scope.droped = false
      scope.selected = data
      scope.value = data.value
      model.$setViewValue(data.value) if model
      event.stopPropagation() if event
      scope.$apply() if event
      if attrs.ngChange && firstChange
        scope.$eval(attrs.ngChange)
        firstChange = false
)

module.filter("sanitize", ['$sce', ($sce) ->
  (htmlCode) ->
    $sce.trustAsHtml(htmlCode)
]);

module.directive('ddItem', () ->
  restrict: 'A'
  template: ''
  link: (scope, element, attrs) ->

    scope.data = scope.$eval(attrs.data)
    scope.selected = false
    return unless scope.data
    element.append(scope.data.name)
    element.click((event) ->
      scope.select(scope.data, element, event)
      scope.selected = true
    )
    updateSelection = () ->
      if (scope.$eval(attrs.ngSelected))
        scope.select(scope.data, element, null)
        scope.selected = scope.$eval(attrs.ngSelected)
    scope.$watch(attrs.ngSelected, updateSelection)
)
