import * as mongoose from 'mongoose';
const config = require('./../config/config.json');

mongoose.connect(config.development.mongodb);

export const Schema = mongoose.Schema;