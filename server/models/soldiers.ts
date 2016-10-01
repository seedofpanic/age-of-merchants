import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopSchema, Troop} from "./troops";
import {ProfileSchema} from "./profiles";

export interface Soldier extends mongoose.Document {
    troop: Troop;
    count: number;
    quality: number;
    power: number;
    life: number;
    check(id, user_id): Promise<boolean>
}

export const SoldierSchema = new Schema({
    id: Schema.Types.ObjectId,
    troop: TroopSchema,
    count: Number,
    quality: Number,
    power: Number,
    life: Number
});

SoldierSchema.methods = {
    check(id, user_id) {
        return this.find({id: id, troop: {profile: {user: {id: user_id}}}});
    }
};

export const SoldierModel = mongoose.model('Soldier', SoldierSchema);