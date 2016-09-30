export interface RegionModel {
    id: number;
    x: number;
    y: number;
}

export default function (db, DataTypes) {
    return db.define('regions', {
        name: DataTypes.STRING,
        x: DataTypes.INTEGER,
        y: DataTypes.INTEGER
    });

};