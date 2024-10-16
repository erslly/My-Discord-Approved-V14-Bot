const db = require('croxydb');
const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.GuildRoleCreate,

    async execute(role) {
        // Mod log kanalının ID'sini al
        const kanalId = db.get(`modlogK_${role.guild.id}`);
        if (!kanalId) return;

        const kanal = role.client.channels.cache.get(kanalId);
        if (!kanal) return;

        // Embed mesajını oluştur
        const embed = new EmbedBuilder()
            .setColor('#00ff00') // Yeşil renk, pozitif bir olay için uygun
            .setTitle('🎉 Yeni Rol Oluşturuldu')
            .setDescription('Sunucuda yeni bir rol oluşturuldu.')
            .addFields(
                { name: '🆔 Rol ID', value: `${role.id}`, inline: true },
                { name: '📛 Rol İsmi', value: `\`${role.name}\``, inline: true },
                { name: '🎨 Renk Kodu', value: `${role.hexColor}`, inline: true },
                { name: '📅 Oluşturulma Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false }
            )
            .setFooter({ text: 'Rol Oluşturma Logu' }) // Alt bilgi
            .setTimestamp(); // Zaman damgasını ekle

        // Embed mesajını mod log kanalına gönder
        try {
            await kanal.send({ embeds: [embed] });
        } catch (err) {
            console.error('Mod log kanalına mesaj gönderilemedi:', err);
        }
    }
};
