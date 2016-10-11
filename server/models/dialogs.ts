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
    check: function (id, user_id): Promise<Dialog> {
        return this.find({id: id, 'users._id': user_id}).exec();
    }
};

export const DialogModel = mongoose.model<Dialog>('Dialog', DialogSchema);