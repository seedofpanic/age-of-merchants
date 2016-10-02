const dropdownTemplate = require('./../../jade/tools/dropdown.jade');

export default angular.module('DropdownModule', [])
    .directive('dropdown', dropdown)
    .filter("sanitize", sanitize)
    .directive('ddItem', ddItem)
    .run(run);

var dds = [];

run.$inject = ['$window'];

function run($window) {
  angular.element($window).bind('click', function () {
        dds.forEach(function (dd) {
          if (!dd.stopClick && dd.scope.droped) {
            dd.scope.search = '';
            dd.scope.droped = false;
            dd.scope.$apply();
          }
          dd.stopClick = false;
        })
      }
  );
}

function dropdown() {

  link.$inject = ['scope', 'element', 'attrs', 'model'];

  return {
    restrict: 'A',
    require: '?ngModel',
    scope: true,
    transclude: true,
    replace: true,
    template: dropdownTemplate,
    link: link
  };

  function link(scope, element, attrs, model) {
    var firstChange = true;
    scope.selected = {};
    scope.droped = false;
    var dd = {
      stopClick: false,
      scope: scope
    };
    dds.push(dd);

    scope.toggle = function () {
      scope.droped = !scope.droped;
      dd.stopClick = true;
      scope.$apply();
    };

    scope.show = function () {
      scope.droped = true;
      dd.stopClick = true;
    };

    scope.hide = function () {
      scope.droped = false;
      dd.stopClick = true;
    };

    if (attrs.action == 'show') {
      element.bind('click', function () {
        scope.show()
      });
    } else {
      element.bind('click', function () {
        scope.toggle();
      });
    }

    scope.select = function (data, element, event) {
      scope.droped = false;
      scope.selected = {
        value: data,
        name: element.html()
      };
      scope.value = data;
      if (model) {
        model.$setViewValue(data);
      }
      if (event) {
        event.stopPropagation();
      }
      if (!scope.$$phase) {
        scope.$apply();
      }
      if (attrs.ngChange && firstChange) {
        scope.$eval(attrs.ngChange);
        firstChange = false;
      }
    };
  }

}

function sanitize($sce) {
  return function (htmlCode) {
    $sce.trustAsHtml(htmlCode);
  }
}

function ddItem() {
  return {
    restrict: 'A',
    template: '',
    link: function (scope, element, attrs) {
      var that = this;
      var ddscope: any = angular.element(element.parents('[dropdown="dropdown"]').first()).scope();

      that.data = attrs.data;
      if (!attrs.data) {
        return;
      }
      scope.click = function (event) {
        ddscope.select(attrs.data, element, event);
      };
      element.click(scope.click);
      scope.$watch(attrs.ngSelected, updateSelection);
      function updateSelection(newVal) {
        if (newVal) {
          ddscope.select(attrs.data, element, null);
        }
      }
    }
  };
}
