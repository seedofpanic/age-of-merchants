import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopMoveSchema, TroopMove} from "./troops_moves";
import {TroopAttackSchema, TroopAttack} from "./troops_attacks";
import {FieldSchema, Field} from "./fields";
import {ProfileSchema, Profile} from "./profiles";

export interface Troop extends mongoose.Document {
    field: Field;
    profile: Profile;
    move: TroopMove;
    attack: TroopAttack[],
    assault: TroopAttack[],
    dead: boolean,
}

export const TroopSchema = new Schema({
    id: Schema.Types.ObjectId,
    field: FieldSchema,
    profile: ProfileSchema,
    move: TroopMoveSchema,
    attack: [TroopAttackSchema],
    assault: [TroopAttackSchema],
    dead: {type: Boolean, default: false}
});

TroopSchema.methods = {
    check(id: string, user_id: string): Promise<Troop> {
        return this.find({id: id, 'profile.user.id': user_id});
    }
}

export const TroopModel = mongoose.model<Troop>('Troop', TroopSchema);