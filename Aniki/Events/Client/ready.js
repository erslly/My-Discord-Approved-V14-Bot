const mongoose = require('mongoose');
const config = require('../../config');
const Levels = require('discord.js-leveling');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.mongodb || '', {});

        if (mongoose.connection.readyState === 1)
             {
            console.log('MongoDB Başarılı bir şekilde bağlanıldı!');
            }

            Levels.setURL(config.mongodb);

            console.log(`${client.user.username} Aktif`);
    }
}
