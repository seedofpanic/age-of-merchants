models = require('./lib/models.js');
var orm = require('orm');
var db_config = require('./database.json');
orm.connect(db_config['dev'].driver + '://' + db_config['dev'].user + ':' + db_config['dev'].password + '@' + db_config['dev'].host + '/' + db_config['dev'].database,
    function (err, db) {
        if (err) {
            console.log(err);
            return;
        }
        models.__init(db, {}, function () {});
        gen();
    }
);
var LENGTH = 50;
function randomArray(length) {
    var arr = [];
    for (var x = 0; x < length; x++ ){
        for (var y = 0; y < length; y++) {
            if (!arr[x]) {
                arr[x] = [];
            }
            if (x == 0 && y == 0) {
                arr[x][y] = 500000 + randomAdd();
            } else if (y == 0) {
                arr[x][y] = arr[x - 1][0] + randomAdd();
            } else if (x == 0) {
                arr[x][y] = arr[0][y - 1] + randomAdd();
            } else {
                arr[x][y] = Math.round((arr[x][y - 1] + arr[x - 1][y]) / 2) + randomAdd();
            }
            if (arr[x][y] < 0) {
                arr[x][y] = 0;
            }
        }
    }
    return arr;
}
function randomAdd() {
    return Math.round(Math.random() * 100000) - 50000;
}
function gen () {
    switch (process.argv[2]) {
        case 'region':
            var name = process.argv[3];
            var x = process.argv[4];
            var y = process.argv[5];
            models.regions.one({
                name: name
            }, function (err, region) {
                if (err) {
                    console.log(err);
                    return
                }
                if (region) {
                    if (process.argv[6] != 'r') {
                        console.log('Region with name ' + name + ' already exists!');
                        return;
                    } else {
                        models.map_fields.find({region_id: region.id}).each(function (field){
                            models.fields_resources.one({map_field_id: field.id}, function (err, resource) {
                                if (resource) {
                                    resource.remove();
                                }
                            });
                            field.remove();
                        });
                        region.remove();
                    }
                }
                var new_region = {
                    name: name,
                    x: x,
                    y: y
                };
                models.regions.create(new_region, function (err, region) {
                   if (err) {
                       console.log(err);
                   }
                    var forest_c_arr = randomArray(LENGTH);
                    for (var i = 0; i < LENGTH; i++) {
                        for (var j = 0; j < LENGTH; j++) {
                            var new_field = {
                                region_id: region.id,
                                x: i,
                                y: j
                            };
                            newField(new_field, {
                                forest_c: forest_c_arr[i][j]
                            });
                        }
                    }
                });
            })
    }
    function newField(new_field, data) {
        var forest_c = data.forest_c;
        var region_id = new_field.region_id;
        var x = new_field.x;
        var y = new_field.y;
        models.fields.create({region_id: region_id,
            x: x,
            y: y
        }, function (err, field) {
            if (err) {
                console.log(err);
                return;
            }
            models.resources.create({
                map_fields_id: field.id,
                forest_c: forest_c
            }, function () {
                console.log(x + 'x' + y)
            });
        });
    }
}