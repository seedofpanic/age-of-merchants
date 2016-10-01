import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {User, UserSchema} from "./users";

export interface Dialog extends mongoose.Document {
    users: User[];
    read: {
        [name: string]: boolean;
    };
}

export const DialogSchema = new Schema({
    id: Schema.Types.ObjectId,
    users: [UserSchema],
    read: Schema.Types.Mixed
});

DialogSchema.methods = {
    check: function (id, user_id) {
        return this.find({id: id, users: {id: user_id}});
    }
}

export const DialogModel = mongoose.model('Dialog', DialogSchema);