angular.module('Map', [])
  .factory('SelectedField', SelectedField)
  .controller('MapCtrl', MapCtrl)
  .controller('FieldBuildingsCtrl', FieldBuildingsCtrl);

function SelectedField() {
  return {f: null};
}

MapCtrl.$inject = ['$http', '$scope', 'Regions', 'ModalsService', 'SelectedField'];

function MapCtrl($http, $scope, Regions, ModalsService, SelectedField) {
  var that = this;
  that.regions = Regions;
  that.sub_type = -1;

  that.getR = function (int) {
    const range = that.max_c - that.min_c;
    const hrange = (range >> 1);
    int -= that.min_c;
    if (hrange == 0) {
      return (int < 1) ? 255 : 0;
    } else {
      return (int < (range >> 1)) ? 255 : 255 * ((range - int) / hrange);
    }
  };

  that.getG = function (int) {
    const range = that.max_c - that.min_c;
    int -= that.min_c;
    const hrange = (range >> 1);
    if (hrange == 0) {
      return (int > hrange) ? 255 : 255 * (int);
    } else {
      return (int > hrange) ? 255 : 255 * (int / hrange);
    }
  };

  that.getRQ = function (int) {
    const range = (that.max_q - that.min_q) * 100;
    int = (int - that.min_q) * 100;
    return (int < (range >> 1)) ? 255 : 255 * ((range - int) / (range >> 1));
  };

  that.getGQ = function (int) {
    const range = (that.max_q - that.min_q) * 100;
    int = (int - that.min_q) * 100;
    return (int > (range >> 1)) ? 255 : 255 * (int / (range >> 1));
  };

  that.load_map = function () {
    var type = that.sub_type;
    if (!type || parseInt(type) == -1) {
      return
    }
    if (that.loading) {
      return;
    }
    that.selected_type = type;
    that.loading = true;
    $http.get('/api/map?region_id=' + that.selected.id + '&type=' + that.map_type + '&sub_type=' + that.sub_type)
      .then(function (res) {
        that.map = res.data;

        if (parseInt(that.map_type) == 1) {
          that.max_c = that.map[0][0].res.c;
          that.min_c = that.map[0][0].res.c;
          that.max_q = that.map[0][0].res.q;
          that.min_q = that.map[0][0].res.q;
          for (let x = that.map.length - 1; x > -1; x--) {
            for (let y = that.map[x].length - 1; y > -1; y--) {
              var tile = that.map[x][y].res;
              if (that.max_c < tile.c) {
                that.max_c = tile.c;
              }
              if (that.min_c > tile.c) {
                that.min_c = tile.c;
              }
              if (that.max_q < tile.q) {
                that.max_q = tile.q;
              }
              if (that.min_q > tile.q) {
                that.min_q = tile.q;
              }
            }
          }
        }
        else if (parseInt(that.map_type) == 2) {
          that.max_c = that.map[0][0].c;
          that.min_c = that.map[0][0].c;
          for (let x = that.map.length - 1; x > -1; x--) {
            for (let y = that.map[x].length - 1; y > -1; y--) {
              var tile = that.map[x][y];
              if (that.max_c < tile.c) {
                that.max_c = tile.c;
              }
              if (that.min_c > tile.c) {
                that.min_c = tile.c;
              }
            }
          }
        }
        that.loading = false;
        setTimeout(function () {
          // TODO: $('.popup').popup();
        }, 0);
      });
  };
  that.open = function (region) {
    that.selected = region;
    that.load_map(that.selected_type);
  }
  $scope.$watch(function () {
    return that.res_type;
  }, function (newVal) {
    that.sub_type = newVal;
    that.load_map();
  });

  $scope.$watch(function () {
    return that.build_type;
  }, function (newVal) {
    that.sub_type = newVal;
    that.load_map();
  })
  $scope.$watch(function () {
    return that.map_type;
  }, function (newVal) {
    if (newVal == 1)
      that.sub_type = that.res_type;
    else
      that.sub_type = that.build_type;
    that.load_map();
  });
  that.openFieldBuildings = function (field) {
    SelectedField.f = field;
    SelectedField.f.filter_mode = that.build_type;
    ModalsService.show('field_buildings', $scope, null, function () {
      $('body').addClass('scrolling');
    });
  };
}

FieldBuildingsCtrl.$inject = ['$scope', '$http', 'SelectedField', '$element'];

function FieldBuildingsCtrl($scope, $http, SelectedField, $element) {
  var that = this;
  that.field = SelectedField.f;
  that.buildings = [];
  const get = function (page) {
    $http.get('/api/field/buildings',
      {
        params: {
          field_id: that.field.id,
          page: page,
          mode: that.field.filter_mode
        }
      })
      .then(function (res) {
        that.buildings = res.data.buildings;
        $scope.pages = res.data.pages;
        $scope.current_page = res.data.page;
      });
  };
  $scope.$watch(function () {
      return $scope.current_page;
    }
    , get);
  get(0);
  $scope.$watch(function () {
      return that.buildings.length
    },
    function (newVal) {
      $scope.$evalAsync(function () {
        $element.modal('refresh');
      });
    });
}