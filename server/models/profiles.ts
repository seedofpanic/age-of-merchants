import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {User} from "./users";

export interface Profile extends mongoose.Document {
    user: 'User';
    name: string;
    gold: number;
    buildings: Building[];
    check(id, user_id): Promise<Profile>;
}

import {UserSchema} from "./users";
import {BuildingSchema, Building} from "./buildings";

export const ProfileSchema = new Schema({
    id: {type: Schema.Types.ObjectId, required: false},
    user: UserSchema,
    name: String,
    gold: Number,
    buildings: [{type: Schema.Types.ObjectId, ref: 'BuildingSchema'}]
});

ProfileSchema.statics = {
    check(id: string, user_id: string): Promise<Profile> {
        return this.findOne({_id: id, 'user._id': user_id}).exec();
    }
};

export const ProfileModel = mongoose.model<Profile>('Profile', ProfileSchema);