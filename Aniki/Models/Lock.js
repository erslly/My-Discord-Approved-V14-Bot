const { Schema, model } = require('mongoose');

const LockDownSchema = new Schema({
    guildID: String,
    channelID: String,
    Time: Number,
});

module.exports = model('LockDown', LockDownSchema);
