import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopSchema, Troop} from "./troops";

export interface TroopAttacks extends mongoose.Document {
    target: Troop;
    troop: Troop;
    check(id, user_id): boolean;
}

export const TroopAttacksSchema = new Schema({
    id: Schema.Types.ObjectId,
    target: TroopSchema,
    troop: TroopSchema
});

TroopAttacksSchema.methods = {
    check(id, user_id) {
        return this.find({id: id, troop: {profile: {user: {id: user_id}}}});
    }
}

export const TroopAttacksModel = mongoose.model('TroopAttacks', TroopAttacksSchema);
