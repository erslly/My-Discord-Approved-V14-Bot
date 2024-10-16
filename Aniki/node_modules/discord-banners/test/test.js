const { Client } = require('discord.js');
const client = new Client();
const { DiscordBanners } = require('discord-banners');
const discordBanners = new DiscordBanners(client);

// Simple usage example to message event!
client.on('message', async (message) => {
    if(message.content === "what is my banner") {
        const banner = await discordBanners.getBanner(message.author.id, { size: 2048, format: "png", dynamic: true })
        if(banner) return message.channel.send(banner)
        else if(!banner) return message.channel.send("User banner not found!")
    }
});


client.login('YOUR_DISCORD_BOT_TOKEN')