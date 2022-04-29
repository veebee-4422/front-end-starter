const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.DB_STRING;

const connection = mongoose.createConnection(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});
const PageSchema = new mongoose.Schema({
    data: String,
});

const User = connection.model('User', UserSchema);
const Page = connection.model('Page', PageSchema);

module.exports = {c1: connection};
