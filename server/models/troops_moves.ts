import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopSchema, Troop} from "./troops";
import {FieldSchema, Field} from "./fields";

export interface TroopMove extends mongoose.Document {
    field: Field;
    troop: Troop;
    check(id, user_id): boolean;
}

export const TroopMoveSchema = new Schema({
    id: Schema.Types.ObjectId,
    field: FieldSchema,
    troop: {type: Schema.Types.ObjectId, ref: 'TroopSchema'}
});

TroopMoveSchema.methods = {
    check(id, user_id) {
        return this.find({id: id, troop: {profile: {user: {id: user_id}}}});
    }
}

export const TroopMoveModel = mongoose.model('TroopMoves', TroopMoveSchema);