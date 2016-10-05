import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {BuildingSchema, Building} from "./buildings";

interface ProductTypeList {
    [name: string]: {
        is_army: boolean;
    }
}

export const ProductTypes: ProductTypeList = {
    MEAT: {
        is_army: false
    }
};

export enum PRODUCT_TYPES {
    MEAT
}

export interface Product extends mongoose.Document {
    building: Building;
    product_type: String;
    count: number;
    quality: number;
    reserved: number;
    price: string;
    export: boolean;
    export_count: number;
    is_army: boolean;
    add(count, quality): Promise<Product>;
    take(count): Promise<Product>;
    check(id, user_id): Promise<Product>;
}

export const ProductSchema = new Schema({
    id: Schema.Types.ObjectId,
    building: {type: Schema.Types.ObjectId, ref: 'Building'},
    product_type: Number,
    count: Number,
    quality: Number,
    reserved: Number,
    price: Number,
    export: Boolean,
    export_count: Number,
    is_army: Boolean
});

ProductSchema.statics = {
    check: function (id, user_id): Promise<Product> {
        return this.find({id: id, 'building.profile.user._id': user_id}).exec();
    }
}

ProductSchema.methods = {
    add: function (count: number, quality: number): Promise<Product> {
        var product: Product = this;
        var old_count = product.count || 0;
        var old_quality = product.quality || 0;
        product.quality = (old_quality * old_count + quality * count) / (old_count + count) || 0;
        product.count = (old_count + count);
        return product.save();
    },
    take: function(count: number): Promise<Product | void> {
        var taken: any = {};
        taken.quality = this.quality;
        if (this.count >= count) {
            this.count -= count;
            taken.count = count;
            return this.save();
        } else {
            taken.count = this.count;
            return this.remove();
        }
    }
}

export const ProductModel = mongoose.model<Product>('Product', ProductSchema);