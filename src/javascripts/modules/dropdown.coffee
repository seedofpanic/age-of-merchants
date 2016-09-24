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
  scope: true
  transclude: true
  replace: true
  templateUrl: '/partials/tools/dropdown.html'
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
      scope.selected =
        value: data
        name: element.html()
      scope.value = data
      model.$setViewValue(data) if model
      event.stopPropagation() if event
      unless scope.$$phase
        scope.$apply()
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
    that = @
    ddscope = angular.element(element.parents('[dropdown="dropdown"]').first()).scope()

    that.data = attrs.data
    return unless attrs.data
    scope.click = (event) ->
      ddscope.select(attrs.data, element, event)
    element.click scope.click
    updateSelection = (newVal) ->
      if (newVal)
        ddscope.select(attrs.data, element, null)
    scope.$watch(attrs.ngSelected, updateSelection)
)
