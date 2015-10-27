module.exports = {
    __init: function (db, models, next) {
        db.load(
            "./models/users",
            "./profiles",
            "./buildings",
            "./regions",
            "./fields",
            "./resources",
            "./contracts",
            "./goods",
            function (err) {
                if (err) {
                    console.log(err);
                }
                module.exports.users = models.users = db.models.users;
                module.exports.profiles = models.profiles = db.models.profiles;
                module.exports.buildings = models.buildings = db.models.buildings;
                module.exports.regions = models.regions = db.models.map_regions;
                module.exports.map_fields = models.map_fields = db.models.map_fields;
                module.exports.fields = models.fields = db.models.fields;
                module.exports.resources = models.resources = db.models.map_fields_resources;
                module.exports.contracts = models.contracts = db.models.contracts;
                module.exports.goods = models.goods = db.models.goods;

                db.models.goods.hasOne('building', db.models.buildings);
                db.models.buildings.hasOne('field', db.models.map_fields);
                db.models.map_fields.hasOne('region', db.models.map_regions);

            }
        );
        next();
    }
};