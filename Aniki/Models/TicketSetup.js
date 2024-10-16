const {model, Schema } = require('mongoose');   

let ticketSetup = new Schema({
    GuildID: String,
    Channel: String,
    Category: String,
    Transcripts: String,
    Handlers: String,
    Everyone: String,
    Description: String,
    Buttons: [String],
});

module.exports = model('TicketSetup', ticketSetup);