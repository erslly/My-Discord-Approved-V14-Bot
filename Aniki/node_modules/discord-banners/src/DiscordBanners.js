const fetch = require("node-fetch");
const {
    Client
} = require("discord.js");
const {
    type
} = require("os");

const allowedFormats = ["webp", "png", "jpg", "jpeg", "gif"];
const allowedSizes = Array.from({
    length: 9
}, (e, i) => 2 ** (i + 4));

class DiscordBanners {
    constructor(client) {
        if (!client) throw new SyntaxError("Please specify a Discord Client.");
        this.client = client;
    };

    async createBannerURL(userId, banner, format = "webp", size = "1024", dynamic) {
        if (dynamic) format = banner.startsWith("a_") ? "gif" : format;
        return `https://cdn.discordapp.com/banners/${userId}/${banner}.${format}${parseInt(size) ? `?size=${parseInt(size)}` : ''}`
    }

    async getBanner(userId, {
        format,
        size,
        dynamic
    } = {}) {
        if (format && !allowedFormats.includes(format)) throw new SyntaxError("Please specify an available format.");
        if (size && (!allowedSizes.includes(parseInt(size)) || isNaN(parseInt(size)))) throw new SyntaxError("Please specify an avaible size.");
        if (dynamic && typeof dynamic !== "boolean") throw new SyntaxError("Dynamic option must be Boolean.")
        let Data = ""
        try {
            await fetch(`https://discord.com/api/v9/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`
                    }
                }).then(res => res.json())
                .then(user => {
                    if (user.code == 50035) throw new SyntaxError("User not found.")
                    if (user.banner !== null) Data = this.createBannerURL(user.id, user.banner, format, size, dynamic)
                    if (user.banner === null && user.banner_color !== null) Data = user.banner_color
                    if (user.banner === null && user.banner_color === null ) throw new SyntaxError("User has no banner or banner color.");
                })
        } catch (err) {
            throw new Error("An unexpected error occurred.");
        }
        return Data
    }
}

module.exports = DiscordBanners