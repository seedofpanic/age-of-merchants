export interface ProfileModel {
    id: number;
    gold: number;
    save: () => Promise<ProfileModel>;
}

export default function (db, DataTypes) {
    return db.define("profiles", {
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "users",
                key: "id"
            }
        },
        name: DataTypes.STRING,
        gold: DataTypes.DECIMAL(10, 2)
    }, {
        classMethods: {
            associate: function () {
                this.belongsTo(db.models.users, {foreignKey: 'user_id'});
            },
            check: function (id, user_id) {
                return this.find({where: {id: id, user_id: user_id}});
            }
        }
    });

};