const db = require('croxydb');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(member) {
        try {
            // Giriş ve çıkış mesajlarını ayarlamak için veritabanından ayarları al
            const hgbb = db.get(`hgbb_${member.guild.id}`);
            const sayacmessage = db.get(`sayacmessage_${member.guild.id}`);

            // Çıkış mesajını göndermek için ayarları kontrol et
            if (hgbb) {
                const channel = member.guild.channels.cache.find(c => c.id === hgbb.channel);
                if (!channel) return;

                const newMemberCount = member.guild.memberCount - 1; // Yeni üye sayısını hesapla

                if (sayacmessage) {
                    const cikismesaj = sayacmessage.leaveMsg
                        .replaceAll("{guild.memberCount}", `${newMemberCount}`)
                        .replaceAll("{guild.name}", `${member.guild.name}`)
                        .replaceAll("{owner.name}", `<@${member.guild.ownerId}>`)
                        .replaceAll("{member}", `<@${member.user.id}>`);
            
                    const cikismesajs = new EmbedBuilder()
                        .setDescription(`${cikismesaj}`);
                    try {
                        await channel.send({ embeds: [cikismesajs] });
                    } catch(err) {
                        console.error("HGBB çıkış mesajı gönderirken bir hata oluştu:", err);
                    }
                } else {
                    const normalmesaj = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle('Güle Güle')
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                        .setURL('https://erslly.xyz/')  // URL'yi güncelle
                        .setDescription(`:outbox_tray: | ${member} Sunucumuzdan Ayrıldı! \n Sunucumuz **${newMemberCount}** kişi oldu!`)
                        .setImage('https://media1.tenor.com/m/oSG6doCX46UAAAAC/shiki-ichinose-idolmaster-cinderella-girls-u149.gif')  // İstediğiniz bir görsel
                        .setTimestamp();
                    try {
                        await channel.send({ embeds: [normalmesaj] });
                    } catch(err) {
                        console.error("Çıkış mesajı gönderirken bir hata oluştu.", err);
                    }
                }
            }
        } catch (error) {
            console.error(`GuildMemberRemove olayında bir hata oluştu: ${error}`);
        }
    }
};
