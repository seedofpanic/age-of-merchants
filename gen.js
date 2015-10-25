var LENGTH = 50;
var COUNT_FIELDS_MAX = LENGTH * LENGTH;
var orm_db = undefined;

models = require('./lib/models.js');
var orm = require('orm');
var db_config = require('./database.json');
orm.connect(db_config['dev'].driver + '://' + db_config['dev'].user + ':' + db_config['dev'].password + '@' + db_config['dev'].host + '/' + db_config['dev'].database,
    function (err, db) {
        orm_db = db;
        if (err) {
            console.log(err);
            return;
        }
        models.__init(db, {}, function () {});
        gen();
    }
);

function randomArray(length, range) {
    var arr = [];
    for (var x = 0; x < length; x++ ){
        for (var y = 0; y < length; y++) {
            if (!arr[x]) {
                arr[x] = [];
            }
            if (x == 0 && y == 0) {
                arr[x][y] = (range >> 1) + randomAdd(range);
            } else if (y == 0) {
                arr[x][y] = arr[x - 1][0] + randomAdd(range);
            } else if (x == 0) {
                arr[x][y] = arr[0][y - 1] + randomAdd(range);
            } else {
                arr[x][y] = ((arr[x][y - 1] + arr[x - 1][y]) >> 1) + randomAdd(range);
            }
            if (arr[x][y] < 0) {
                arr[x][y] = 0;
            }
        }
    }
    return arr;
}
function randomAdd(range) {
    return Math.random() * (range >> 2) - (range >> 3);
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
                    console.log('Generating forest...');
                    var forest_c_arr = randomArray(LENGTH, 1000000);
                    var forest_q_arr = randomArray(LENGTH, 10);
                    console.log('Generating animals...');
                    var animals_c_arr = randomArray(LENGTH, 1000000);
                    var animals_q_arr = randomArray(LENGTH, 10);
                    console.log('Generating soil...');
                    var soil_c_arr = randomArray(LENGTH, 1000000);
                    var soil_q_arr = randomArray(LENGTH, 10);
                    for (var i = 0; i < LENGTH; i++) {
                        for (var j = 0; j < LENGTH; j++) {
                            var new_field = {
                                region_id: region.id,
                                x: i,
                                y: j
                            };
                            newField(new_field, {
                                forest_c: forest_c_arr[i][j],
                                forest_q: forest_q_arr[i][j],
                                animals_c: animals_c_arr[i][j],
                                animals_q: animals_q_arr[i][j],
                                soil_c: soil_c_arr[i][j],
                                soil_q: soil_q_arr[i][j]
                            });
                        }
                    }
                });
            })
    }
    var count_fields = 0;
    function newField(new_field, data) {
        var forest_c = data.forest_c;
        var forest_q = data.forest_q;
        var animals_c = data.animals_c;
        var animals_q = data.animals_q;
        var soil_c = data.soil_c;
        var soil_q = data.soil_q;
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
                forest_c: Math.round(forest_c),
                forest_q: forest_q.toFixed(2),
                forest_a: forest_c >> 10,
                animals_c: Math.round(animals_c),
                animals_q: animals_q.toFixed(2),
                animals_a: animals_c >> 10,
                soil_c: Math.round(soil_c),
                soil_q: soil_q.toFixed(2),
                soil_a: soil_c >> 10
            }, function () {
                count_fields++;
                console.log(x + 'x' + y);
                if (count_fields >= COUNT_FIELDS_MAX) {
                    console.log('done!');
                    orm_db.close();
                }
            });
        });
    }
}