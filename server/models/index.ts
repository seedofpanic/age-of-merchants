import * as mongoose from 'mongoose';

const env = process.env.NODE_ENV || 'development';

const config = require('./../config/config.json');

mongoose.connect(config[env].mongodb);

export const Schema = mongoose.Schema;