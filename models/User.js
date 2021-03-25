/**
 * Create model for user
 */

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

const User = mongoose.model('User', UserSchema);

module.exports = User;