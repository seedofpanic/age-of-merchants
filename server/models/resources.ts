import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {FieldSchema, Field} from "./fields";

export interface Resource extends mongoose.Document {
    field: Field;
    type: RESOURSE_TYPES;
    c: number;
    q: number;
    a: number;
}

export enum RESOURSE_TYPES {
    GOLD,
    FOREST,
    ANIMALS,
    SOIL,
    METAL
}

export const ResourceSchema = new Schema({
    id: Schema.Type.ObjectId,
    field: FieldSchema,
    type: RESOURSE_TYPES,
    c: Number,
    q: Number,
    a: Number
});

export const ResourceModel = mongoose.model('Resource', ResourceSchema);