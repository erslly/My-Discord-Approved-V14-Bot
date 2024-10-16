const mongoose = require('mongoose');

const gameChannelSchema = new mongoose.Schema({
    serverId: { type: String, required: true },
    channelId: { type: String, required: true }
});

module.exports = mongoose.model('GameChannel', gameChannelSchema);
