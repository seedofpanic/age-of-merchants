import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {User} from "./users";

export interface Profile extends mongoose.Document {
    user: 'User';
    name: string;
    gold: number;
    check(id, user_id): boolean;
}

import {UserSchema} from "./users";

export const ProfileSchema = new Schema({
    id: Schema.Types.ObjectId,
    user: UserSchema,
    name: String,
    gold: Number
});

ProfileSchema.methods = {
    check(id, user_id) {
        return this.find({where: {id: id, user_id: user_id}});
    }
}

export const ProfileModel = mongoose.model('Profile', ProfileSchema);