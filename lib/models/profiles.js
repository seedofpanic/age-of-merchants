module.exports = function (db, cb) {
    db.define("profiles", {
        id: {type: 'serial', key: true},
        user_id: {type: 'integer'},
        name: String,
        gold: {type: 'integer', defaultValue: 0}
    }, {
        methods: {}
    });

    return cb();
};