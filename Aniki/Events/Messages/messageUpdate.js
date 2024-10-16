const db = require('croxydb');
const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.MessageUpdate,

    async execute(oldMsg, newMsg) {
        // Sunucu kontrolü
        if (!oldMsg.guild) return;

        // Mod log kanalının ID'sini al
        const kanalId = db.get(`modlogK_${oldMsg.guild.id}`);
        if (!kanalId) return;

        const kanal = oldMsg.client.channels.cache.get(kanalId);
        if (!kanal) return;

        // Eski ve yeni mesaj içeriği kontrolü
        if (!oldMsg.content || !newMsg.content) return;
        if (!oldMsg.author || !oldMsg.author.tag) return;
        if (newMsg.author?.bot) return;
        if (oldMsg.content === newMsg.content) return;

        // Embed mesajını oluştur
        const embed = new EmbedBuilder()
            .setColor('#ffcc00') // Sarı renk, dikkat çekici
            .setTitle('✏️ Mesaj Düzenlendi')
            .setDescription('Bir mesaj güncellendi.')
            .addFields(
                { name: '📤 Kullanıcı', value: `${oldMsg.author.tag}`, inline: true },
                { name: 'ID', value: `${oldMsg.author.id}`, inline: true },
                { name: '✉️ Eski Mesaj', value: `\`\`\`${oldMsg.content}\`\`\``, inline: false },
                { name: '✉️ Yeni Mesaj', value: `\`\`\`${newMsg.content}\`\`\``, inline: false },
                { name: '🕒 Düzenleme Zamanı', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false }
            )
            .setFooter({ text: 'Mesaj düzenleme' }) // Alt bilgi
            .setTimestamp(); // Zaman damgasını ekle

        // Embed mesajını mod log kanalına gönder
        try {
            await kanal.send({ embeds: [embed] });
        } catch (err) {
            console.error('Mod log kanalına mesaj gönderilemedi:', err);
        }
    }
};
