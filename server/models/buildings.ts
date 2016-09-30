import {ProfileModel} from "./profiles";
import {FieldModel} from "./fields";
import {DataTypes} from "sequelize";
import {Sequelize} from "sequelize";

export interface BuildingAttribute{
    id?: number;
    name: string;
    profile?: ProfileModel;
    field?: FieldModel;
    buildtime: number;
    status: number;
    type: number;
    workers_c?: number;
    workers_q?: number;
    worker_s?: number;
    out_type: number;
    mode: BUILDINGS_MODES;
}

export interface BuildingInstance extends Sequelize.Instance<BuildingAttribute>, BuildingAttribute {
}

export interface BuildingModel extends Sequelize.Model<BuildingInstance, BuildingAttribute> { }

export enum BUILDINGS_MODES {
    GOLDMINE,
    MINE,
    TOWN,
    FACTORY,
    SHOP,
    CASTLE
}

export enum BUILDINGS_TYPES {
    GOLD_MINE,
    CASTLE,
    METAL_MINE,
    FORGE,
    SAWMILL,
    HUNTING,
    VILLAGE,
    SCHOOL
}

export const BUILDING_PARAMS: {
    [name: string]: any;
};

BUILDING_PARAMS[BUILDINGS_TYPES.SAWMILL] = {
    'build_time': 1,
    'resources_out': [{
        type: 2,
        count: 100,
        mode: BUILDINGS_MODES.MINE
    }],
    max_workers: 5,
    price: 100
};
BUILDING_PARAMS[BUILDINGS_TYPES.HUNTING] = {
    'build_time': 2,
    'resources_out': [{
        type: 1,
        count: 10,
        mode: BUILDINGS_MODES.MINE
    }],
    max_workers: 5,
    price: 100
};
BUILDING_PARAMS[BUILDINGS_TYPES.VILLAGE] = {
    build_time: 1,
    resources_out: [
        {
            type: 3,
            count: 5,
            max: 250,
            mode: BUILDINGS_MODES.TOWN
        }
    ],
    max_workers: 5,
    price: 50,
    upkeep: 1
};
BUILDING_PARAMS[BUILDINGS_TYPES.SCHOOL] = {
    build_time: 2,
    resources_out: [
        {
            type: 4,
            count: 5,
            need: [{type: 3, count: 1}, {type: 5, count: 1}],
            mode: BUILDINGS_MODES.FACTORY
        }
    ],
    max_workers: 5,
    price: 100
};
BUILDING_PARAMS[BUILDINGS_TYPES.FORGE] = {
    build_time: 2,
    resources_out: [
        {
            type: 5,
            count: 5,
            need: [{type: 2, count: 1}, {type: 6, count: 1}],
            mode: BUILDINGS_MODES.FACTORY
        }
    ],
    max_workers: 5,
    price: 200
};
BUILDING_PARAMS[BUILDINGS_TYPES.METAL_MINE] = {//metal mine
    build_time: 2,
    resources_out: [
        {
            type: 6,
            count: BUILDINGS_MODES.MINE
        }
    ],
    max_workers: 5,
    price: 100
};
BUILDING_PARAMS[BUILDINGS_TYPES.CASTLE] = {//castle
    build_time: 3,
    resources_out: [
        {
            mode: BUILDINGS_MODES.CASTLE
        }
    ],
    max_workers: 5,
    upkeep: 10,
    price: 10000
};
BUILDING_PARAMS[BUILDINGS_TYPES.GOLD_MINE] = {//gold mine
    build_time: 1,
    resources_out: [
        {
            type: 0,
            out: 100,
            mode: BUILDINGS_MODES.GOLDMINE
        }
    ],
    price: 300
};

module.exports = function (db: Sequelize, DataTypes: DataTypes) {

    return db.define<BuildingInstance, BuildingAttribute>('buildings', {
        name: DataTypes.STRING,
        field_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "fields",
                key: "id"
            }
        },
        profile_id: {
            type: DataTypes.BIGINT,
            references: {
                model: "profiles",
                key: "id"
            }
        },
        buildtime: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        type: DataTypes.INTEGER,
        workers_c: DataTypes.INTEGER,
        workers_q: DataTypes.DECIMAL(10,2),
        worker_s: DataTypes.DECIMAL(10,2),
        out_type: DataTypes.INTEGER,
        mode: DataTypes.INTEGER
    }, buildingParams());

    function buildingParams(): BuildingAttribute {
        const self: any = this;
        return {
            classMethods: {
                associate(): void {
                    self.belongsTo(db.models.fields, {foreignKey: 'field_id'});
                    self.belongsTo(db.models.profiles, {foreignKey: 'profile_id'});
                },
                new(name: string, type: number, out_type: number, region_id: number,
                    field_x: number, field_y: number, profile: ProfileModel): Promise<BuildingModel> {
                    const params = db.models.buildings.params[type];
                    if (profile.gold < params.price) {
                        return Promise.reject('not_enoth_gold');
                    }
                    return db.models.fields.find({where: {region_id: region_id, x: field_x, y: field_y}})
                        .then(function (field: FieldModel): Promise<BuildingModel> {
                            var new_building: BuildingModel = {
                                profile: profile,
                                type: type,
                                name: name,
                                field: field,
                                buildtime: params.build_time,
                                status: 0,
                                out_type: out_type,
                                mode: <BUILDINGS_MODES>params.resources_out[out_type].mode
                            };
                            return db.models.buildings.create(new_building).then(function (building: BuildingModel): Promise<BuildingModel> {
                                profile.gold -= params.price;
                                const promise: Promise<BuildingModel> =
                                    new Promise<BuildingModel>((resolve) => {
                                            profile.save().then((profile) => {
                                                resolve(building);
                                            })
                                        }
                                    );
                                return promise;
                            });
                        });
                },
                check: function (id: number, user_id: number): Promise<BuildingModel> {
                    return self.find({
                        where: {id: id},
                        include: {model: db.models.profiles, required: true, where: {user_id: user_id}}
                    });
                },
                statuses: {
                    CONSTRUCTING: 0,
                    ACTIVE: 1,
                    CANT_PAY: 2
                },
                is_army: {
                    4: true
                },
                params: {}
            },
            instanceMethods: {
                addProducts: function (product_type, count, quality) {
                    var building = this;
                    return db.models.products.find({
                        where: {
                            building_id: building.id,
                            product_type: product_type
                        }
                    }).then(function (product) {
                        if (product) {
                            return product.add(count, quality);
                        } else {
                            const new_product = {
                                building_id: building.id,
                                product_type: product_type,
                                is_army: db.models.buildings.is_army[product_type] || false
                            };
                            db.models.products.create(new_product).then(function (product) {
                                return product.add(count, quality);
                            });
                            return Promise.resolve();
                        }
                    });
                }
            }
        };
    }

};