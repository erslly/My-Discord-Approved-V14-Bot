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

        // Üye susturulması kaldırıldığında kontrol et
        if (oldMember.communicationDisabledUntil && !newMember.communicationDisabledUntil) {
            let executor = "Bilinmiyor";

            try {
                // Denetim kaydı geçmişini kontrol et
                const fetchedLogs = await newMember.guild.fetchAuditLogs({
                    limit: 1
                });

                // Son kaydı al
                const memberUpdateLog = fetchedLogs.entries.first();

                if (memberUpdateLog) {
                    // Zaman aşımını kaldıran yetkiliyi kontrol et
                    const { executor: logExecutor, target } = memberUpdateLog;
                    if (target.id === newMember.id && logExecutor) {
                        executor = logExecutor.tag;
                    }
                }
            } catch (err) {
                console.error('Denetim kayıtları alınamadı:', err);
            }

            // Embed mesajını oluştur
            const embed = new EmbedBuilder()
                .setColor('#00ff00') // Yeşil renk
                .setTitle('🔊 Üyenin Susturulması Kaldırıldı')
                .setDescription(`${newMember.user.tag} susturulması kaldırıldı.`)
                .addFields(
                    { name: '📤 Kullanıcı', value: `${newMember.user.tag}`, inline: true },
                    { name: 'ID', value: `${newMember.user.id}`, inline: true },
                    { name: 'Yetkili', value: executor, inline: true }
                )
                .setFooter({ text: 'Susturulma Kaldırıldı' }) // Alt bilgi
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
