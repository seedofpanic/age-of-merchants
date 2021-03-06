import * as mongoose from 'mongoose';
import {Schema} from "./index";
import {Profile} from "./profiles";

export interface User extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    logins: number;
    last_login: Date;
    profiles: Profile[];
    validPassword(password): boolean;
    setPassword(password): Promise<User>;
}


var passwordHash = require('password-hash');

export const UserSchema = new Schema({
    id: {type: Schema.Types.ObjectId, required: false},
    email: {type: String, required: true},
    username: {type: String, required: false},
    password: {type: String, required: false},
    logins: {type: Number, required: false},
    last_login: {type: Number, required: false},
    profiles: ['ProfileSchema']
});

UserSchema.methods = {
    validPassword(password) {
        return passwordHash.verify(password, this.password);
    },
    setPassword(password) {
        this.password = passwordHash.generate(password);
        return this.save();
    }
}

export const UserModel = mongoose.model<User>('User', UserSchema);
