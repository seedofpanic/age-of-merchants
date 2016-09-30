module.exports = function (db, DataTypes) {
    return db.define('regions', {
        name: DataTypes.STRING,
        x: DataTypes.INTEGER,
        y: DataTypes.INTEGER
    });

};