import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {RegionSchema, Region} from "./regions";

export interface Field extends mongoose.Document {
    region: Region;
    x: number;
    y: number;
    avg_salary: number;
}

export const FieldSchema = new Schema({
    id: Schema.Types.ObjectId,
    region: RegionSchema,
    x: Number,
    y: Number,
    avg_salary: Number,
    methods: {
    }
});

export const FieldModel = mongoose.model<Field>('Field', FieldSchema);