import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {TroopSchema, Troop} from "./troops";

export interface TroopAttack extends mongoose.Document {
    target: Troop;
    troop: Troop;
    check(id: string, user_id: string): boolean;
}

export const TroopAttackSchema = new Schema({
    id: Schema.Types.ObjectId,
    target: {type: Schema.Types.ObjectId, ref: 'TroopSchema'},
    troop: {type: Schema.Types.ObjectId, ref: 'TroopSchema'}
});

TroopAttackSchema.methods = {
    check(id, user_id): Promise<TroopAttack> {
        return this.find({id: id, 'troop.profile.user._id': user_id});
    }
}

export const TroopAttackModel = mongoose.model<TroopAttack>('TroopAttacks', TroopAttackSchema);
