import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {UserSchema, User} from "./users";
import {DialogSchema, Dialog} from "./dialogs";

export interface Message extends mongoose.Document {
    msg: string,
    user: User,
    dialog: Dialog,
    read: {
        [name: string]: boolean
    },
}

export const MessageSchema = new Schema({
    id: Schema.Types.ObjectId,
    msg: String,
    user: UserSchema,
    dialog: DialogSchema,
    read: Schema.Types.Mixed
});

export const MessageModel = mongoose.model<Message>('Message', MessageSchema);