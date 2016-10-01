import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopSchema, Troop} from "./troops";
import {FieldSchema, Field} from "./fields";

export interface TroopMoves extends mongoose.Document {
    field: Field;
    troop: Troop;
    check(id, user_id): boolean;
}

export const TroopMovesSchema = new Schema({
    id: Schema.Types.ObjectId,
    field: FieldSchema,
    troop: TroopSchema
});

TroopMovesSchema.methods = {
    check(id, user_id) {
        return this.find({id: id, troop: {profile: {user: {id: user_id}}}});
    }
}

export const TroopMovesModel = mongoose.model('TroopMoves', TroopMovesSchema);