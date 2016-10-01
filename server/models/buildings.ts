import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {ProfileSchema, Profile} from "./profiles";
import {FieldSchema, Field} from "./fields";


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

export enum BUILDINGS_STATUSES {
    CONSTRUCTING,
    ACTIVE,
    CANT_PAY
}

export const BUILDING_PARAMS: {
    [name: string]: any;
} = {};

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

export interface Building extends mongoose.Document {
    name: string;
    profile: Profile;
    field: Field;
    buildtime: number;
    status: number;
    type: number;
    workers_c: number;
    workers_q: number;
    worker_s: number;
    out_type: number;
    mode: BUILDINGS_MODES;
    statuses: BUILDINGS_STATUSES;
    check(id: number, user_id: number): boolean;
}

import {ProductModel, ProductTypes, PRODUCT_TYPES, Product} from "./products";

export const BuildingSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    profile: ProfileSchema,
    products: [ProfileSchema],
    field: FieldSchema,
    buildtime: Number,
    status: Number,
    type: Number,
    workers_c: Number,
    workers_q: Number,
    worker_s: Number,
    out_type: Number,
    mode: String,
    statuses: String
});

BuildingSchema.statics = {
    addProducts: function (product_type, count, quality) {
        var building = this;
        return ProductModel.findOne({
            building: {id: building.id},
            product_type: product_type
        }, function (product) {
            if (product) {
                return product.add(count, quality);
            } else {
                const new_product = {
                    building: building,
                    product_type: product_type,
                    is_army: ProductTypes[PRODUCT_TYPES.MEAT].is_army
                };
                ProductModel.create(new_product).then(function (product: Product) {
                    return product.add(count, quality).then(() => {});
                });
                return Promise.resolve();
            }
        });
    },
}
BuildingSchema.methods = {
    check: function (id: number, user_id: number): Promise<boolean> {
        return BuildingModel.findById(id).then();
    }
}

export const BuildingModel = mongoose.model('Building', BuildingSchema);