import * as mongoose from 'mongoose';
import {Schema} from "./index";

export interface Region extends mongoose.Document {
    name: string;
    x: number;
    y: number;
}

export const RegionSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    x: Number,
    y: Number
});

export const RegionModel = mongoose.model('Region', RegionSchema);