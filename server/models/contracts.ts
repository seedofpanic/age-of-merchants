import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {ProductSchema, Product} from "./products";
import {BuildingSchema, Building} from "./buildings";

export interface Contract extends mongoose.Document {
    product: Product;
    dest: Building;
    count: number;
    type: number;
    done: boolean;
}

export const ContractSchema = new Schema({
    id: Schema.Types.ObjectId,
    product: ProductSchema,
    dest: BuildingSchema,
    count: Number,
    type: Number,
    done: Boolean
});

ContractSchema.methods = {
    check: function (id, user_id) {
        return this.find({id: id, product: {building: {profile: {user: {id: user_id}}}}});
    }
}

export const ContractModel = mongoose.model('Contract', ContractSchema);