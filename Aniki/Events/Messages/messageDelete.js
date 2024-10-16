const db = require('croxydb');
const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.MessageDelete,

    async execute(message) {
        // Eğer mesaj silinen mesajın olduğu sunucuya mod log kanalı ayarlanmamışsa hiçbir işlem yapma
        if (!message.guild || !db.has(`modlogK_${message.guild.id}`)) return;

        // Mod log kanalının ID'sini al
        const kanalId = db.get(`modlogK_${message.guild.id}`);
        const modLogChannel = message.client.channels.cache.get(kanalId);

        // Kanal bulunamazsa hata mesajı yazdır
        if (!modLogChannel) {
            console.error(`Mod log kanalı bulunamadı: ${kanalId}`);
            return;
        }

        // Embed mesajını oluştur
        const embed = new EmbedBuilder()
            .setColor('#ff0000') // Kırmızı renk
            .setTitle('🗑️ Mesaj Silindi')
            .setDescription('Bir mesaj silindi.')
            .addFields(
                { name: '📤 Kullanıcı', value: `${message.author.tag}`, inline: true },
                { name: 'ID', value: `${message.author.id}`, inline: true },
                { name: '✉️ Silinen Mesaj', value: message.content || 'Mesaj içeriği mevcut değil.', inline: false },
                { name: '🕒 Silindiği Zaman', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false }
            )
            .setFooter({ text: `Silindi` }) // Alt bilgi
            .setTimestamp(); // Zaman damgasını ekle

        // Embed mesajını mod log kanalına gönder
        try {
            await modLogChannel.send({ embeds: [embed] });
        } catch (err) {
            console.error('Mod log kanalına mesaj gönderilemedi:', err);
        }
    }
};
