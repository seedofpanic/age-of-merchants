import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopMovesSchema, TroopMoves} from "./troops_moves";
import {TroopAttacksSchema, TroopAttacks} from "./troops_attacks";
import {FieldSchema, Field} from "./fields";
import {ProfileSchema, Profile} from "./profiles";

export interface Troop extends mongoose.Document {
    field: Field;
    profile: Profile;
    move: TroopMoves;
    attack: TroopAttacks[],
    assault: TroopAttacks[],
    dead: boolean,
}

export const TroopSchema = new Schema({
    id: Schema.Types.ObjectId,
    field: FieldSchema,
    profile: ProfileSchema,
    move: TroopMovesSchema,
    attack: [TroopAttacksSchema],
    assault: [TroopAttacksSchema],
    dead: {type: Boolean, default: false}
});

TroopSchema.methods = {
    check(id, user_id) {
        return this.find({id: id, profile: {user: {id: user_id}}});
    }
}

export const TroopModel = mongoose.model('Troop', TroopSchema);