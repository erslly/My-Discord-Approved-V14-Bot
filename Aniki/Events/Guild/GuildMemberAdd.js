const db = require('croxydb');
const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {
        try {
            const kayitSistemi = db.get(`kayıtsistemi_${member.guild.id}`);
            const otoRolId = db.get(`otorol_${member.guild.id}`);
            const autoTag = db.get(`ototag_${member.guild.id}`); // Oto-tag'ı veritabanından al

            // Botlara rol ekleme
            if (member.user.bot) {
                const botRoleId = db.get(`botrol_${member.guild.id}`);
                if (botRoleId) {
                    const botRole = member.guild.roles.cache.get(botRoleId);
                    if (botRole) {
                        await member.roles.add(botRole);
                        console.log(`Bot rolü ${member.user.tag} adlı bota verildi.`);
                    } else {
                        console.warn(`Bot rolü ${botRoleId} bulunamadı.`);
                    }
                } else {
                    console.warn(`Bot rolü veritabanında tanımlı değil.`);
                }
            } 
            // Kullanıcılara rol ekleme
            else {
                if (kayitSistemi) {
                    // Kayıt sistemi etkinse kayıtsız rolünü ekleyin
                    const { kayıtsızrol } = kayitSistemi;
                    const kayıtsızRol = member.guild.roles.cache.get(kayıtsızrol);
                    if (kayıtsızRol) {
                        await member.roles.add(kayıtsızRol);
                        console.log(`Kayıtsız rolü ${member.user.tag} adlı kullanıcıya verildi.`);
                    } else {
                        console.warn(`Kayıtsız rolü ${kayıtsızrol} bulunamadı.`);
                    }
                } else if (otoRolId) {
                    // Kayıt sistemi etkin değilse oto rolü ekleyin
                    const otoRol = member.guild.roles.cache.get(otoRolId);
                    if (otoRol) {
                        await member.roles.add(otoRol);
                        console.log(`Üyeye otomatik rol ${member.user.tag} adlı kullanıcıya verildi.`);
                    } else {
                        console.warn(`Oto-rol ${otoRolId} bulunamadı.`);
                    }
                } else {
                    console.warn(`Oto-rol veritabanında tanımlı değil.`);
                }

                // Kullanıcılara oto-tag ekleme
                if (autoTag) {
                    const newNickname = `${autoTag} ${member.user.username}`.slice(0, 32);
                    await member.setNickname(newNickname);
                    console.log(`Kullanıcıya ${newNickname} olarak oto-tag verildi.`);
                } else {
                    console.warn(`Oto-tag veritabanında tanımlı değil.`);
                }

                // Ekstra rol ekleme
                const extraRoleId = db.get(`extraRole_${member.guild.id}`);
                if (extraRoleId) {
                    const extraRole = member.guild.roles.cache.get(extraRoleId);
                    if (extraRole) {
                        await member.roles.add(extraRole);
                        console.log(`Ekstra rol ${member.user.tag} adlı kullanıcıya verildi.`);
                    } else {
                        console.warn(`Ekstra rol ${extraRoleId} bulunamadı.`);
                    }
                } else {
                    console.warn(`Ekstra rol veritabanında tanımlı değil.`);
                }
            }

            // Hoşgeldin ve çıkış mesajları
            const hgbb = db.get(`hgbb_${member.guild.id}`);
            const sayacmessage = db.get(`sayacmessage_${member.guild.id}`);

            if (hgbb) {
                const channel = member.guild.channels.cache.get(hgbb.channel);
                if (!channel) {
                    console.error("Hoşgeldin mesajı gönderilecek kanal bulunamadı.");
                    return;
                }

                if (sayacmessage) {
                    const girismesaj = sayacmessage.joinMsg
                        .replaceAll("{guild.memberCount}", `${member.guild.memberCount}`)
                        .replaceAll("{guild.name}", `${member.guild.name}`)
                        .replaceAll("{owner.name}", `<@${member.guild.ownerId}>`)
                        .replaceAll("{member}", `<@${member.user.id}>`);

                    const girismesajs = new EmbedBuilder()
                        .setDescription(`${girismesaj}`);
                    
                    try {
                        await channel.send({ embeds: [girismesajs] });
                        console.log("HGBB mesajı başarıyla gönderildi.");
                    } catch (err) {
                        console.error("HGBB mesajı gönderilirken bir hata oluştu:", err);
                    }
                } else {
                    const normalmeesage = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle('Hoşgeldin')
                        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
                        .setURL('https://erslly.xyz/')
                        .setDescription(`:inbox_tray: | ${member} Sunucumuza Katıldı! \n Sunucumuz **${member.guild.memberCount}** kişi oldu!`)
                        .setImage('https://media1.tenor.com/m/2hBSkJhJarMAAAAC/hi.gif')
                        .setTimestamp();
                    
                    try {
                        await channel.send({ embeds: [normalmeesage] });
                        console.log("Normal hoşgeldin mesajı başarıyla gönderildi.");
                    } catch (err) {
                        console.error("Normal mesaj gönderilirken bir hata oluştu.", err);
                    }
                }
            }

            // Alternatif hoşgeldin mesajı
            const alternativeChannelId = db.get(`alternativeChannel_${member.guild.id}`);
            if (alternativeChannelId) {
                const alternativeChannel = member.guild.channels.cache.get(alternativeChannelId);
                if (alternativeChannel) {
                    const alternativeWelcomeMessage = new EmbedBuilder()
                        .setColor('#00ff00')
                        .setTitle('Özel Hoşgeldin')
                        .setDescription(`Merhaba ${member}, özel bir kanala hoş geldin!`);

                    try {
                        await alternativeChannel.send({ embeds: [alternativeWelcomeMessage] });
                        console.log(`Özel hoşgeldin mesajı ${member.user.tag} adlı kullanıcıya gönderildi.`);
                    } catch (err) {
                        console.error("Özel hoşgeldin mesajı gönderilirken bir hata oluştu:", err);
                    }
                } else {
                    console.warn(`Alternatif kanal ${alternativeChannelId} bulunamadı.`);
                }
            }
        } catch (error) {
            console.error(`GuildMemberAdd olayında bir hata oluştu: ${error}`);
        }
    }
};
