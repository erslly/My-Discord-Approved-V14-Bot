const db = require('croxydb');
const { EmbedBuilder, Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,

    /**
     * Üye güncellendiğinde tetiklenen olay.
     * @param {import('discord.js').GuildMember} oldMember - Eski üye verisi.
     * @param {import('discord.js').GuildMember} newMember - Yeni üye verisi.
     */
    async execute(oldMember, newMember) {
        // Sunucuya mod log kanalı ayarlanmamışsa hiçbir işlem yapma
        if (!newMember.guild || !db.has(`modlogK_${newMember.guild.id}`)) return;

        // Mod log kanalının ID'sini al
        const kanalId = db.get(`modlogK_${newMember.guild.id}`);
        const modLogChannel = newMember.guild.channels.cache.get(kanalId);

        // Kanal bulunamazsa hata mesajı yazdır
        if (!modLogChannel) {
            console.error(`Mod log kanalı bulunamadı: ${kanalId}`);
            return;
        }

        // Üye susturulmuşsa kontrol et
        if (!oldMember.communicationDisabledUntil && newMember.communicationDisabledUntil) {
            // Susturulma bitiş tarihini belirle
            const muteEndTime = newMember.communicationDisabledUntil;

            // Embed mesajını oluştur
            const embed = new EmbedBuilder()
                .setColor('#ffcc00') // Sarı renk
                .setTitle('🔇 Üye Susturuldu')
                .setDescription(`${newMember.user.tag} susturuldu.`)
                .addFields(
                    { name: '📤 Kullanıcı', value: `${newMember.user.tag}`, inline: true },
                    { name: 'ID', value: `${newMember.user.id}`, inline: true },
                    { name: '⏰ Susturulma Bitiş Tarihi', value: `<t:${Math.floor(muteEndTime.getTime() / 1000)}:F>`, inline: false }
                )
                .setFooter({ text: 'Susturulma' }) // Alt bilgi
                .setTimestamp(); // Zaman damgasını ekle

            // Embed mesajını mod log kanalına gönder
            try {
                await modLogChannel.send({ embeds: [embed] });
            } catch (err) {
                console.error('Mod log kanalına mesaj gönderilemedi:', err);
            }
        }
    }
};
