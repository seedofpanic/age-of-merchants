var LENGTH = 50;
var COUNT_FIELDS_MAX = LENGTH * LENGTH;

var models = require('./models/index');
gen();

function randomArray(length, range, min) {
    if (!min) {
        min = 0;
    }
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
            if (arr[x][y] < min) {
                arr[x][y] = min;
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
            models.regions.find({
                where: {name: name}
            }).then(function (region) {
                if (region) {
                    if (process.argv[6] != 'r') {
                        console.log('Region with name ' + name + ' already exists!');
                        models.sequelize.close();
                        return;
                    } else {
                        models.fields.findAll({where: {region_id: region.id}}).then(function (fields) {
                            var pendings = fields.length;
                            fields.forEach(function (field){
                                models.fields_resources.findAll({where: {field_id: field.id}}).then(function (resources) {
                                    if (resources) {
                                        resources.forEach(function (resource) {
                                            var res_p = resources.length;
                                            resource.destroy().then(function () {
                                                res_p--;
                                                if (res_p == 0) {
                                                    field.destroy().then(function () {
                                                        pendings--;
                                                        if (pendings == 0) {
                                                            region.destroy();
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    }
                }
                var new_region = {
                    name: name,
                    x: x,
                    y: y
                };
                models.regions.create(new_region).then(function (region) {
                    console.log('Generating forest...');
                    var forest_c_arr = randomArray(LENGTH, 1000000);
                    var forest_q_arr = randomArray(LENGTH, 1000, 1);
                    console.log('Generating animals...');
                    var animals_c_arr = randomArray(LENGTH, 1000000);
                    var animals_q_arr = randomArray(LENGTH, 1000, 1);
                    console.log('Generating soil...');
                    var soil_c_arr = randomArray(LENGTH, 1000000);
                    var soil_q_arr = randomArray(LENGTH, 1000, 1);
                    console.log('Generating metal...');
                    var metal_c_arr = randomArray(LENGTH, 1000000);
                    var metal_q_arr = randomArray(LENGTH, 1000, 1);
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
                                soil_q: soil_q_arr[i][j],
                                metal_c: soil_c_arr[i][j],
                                metal_q: soil_q_arr[i][j]
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
        var metal_c = data.metal_c;
        var metal_q = data.metal_q;
        var region_id = new_field.region_id;
        var x = new_field.x;
        var y = new_field.y;
        models.fields.create({region_id: region_id,
            x: x,
            y: y
        }).then(function (field) {
            models.fields_resources.create({
                field_id: field.id,
                forest_c: Math.round(forest_c),
                forest_q: Math.round(forest_q) / 100,
                forest_a: forest_c >> 10,
                animals_c: Math.round(animals_c),
                animals_q: Math.round(animals_q.toFixed(2)) / 100,
                animals_a: animals_c >> 10,
                soil_c: Math.round(soil_c),
                soil_q: Math.round(soil_q) / 100,
                soil_a: soil_c >> 10,
                metal_c: Math.round(metal_c),
                metal_q: Math.round(metal_q) / 100,
                metal_a: metal_c >> 10
            }).then(function () {
                count_fields++;
                //console.log(x + 'x' + y);
                if (count_fields >= COUNT_FIELDS_MAX) {
                    console.log('done!');
                    models.sequelize.close();
                }
            });
        });
    }
}