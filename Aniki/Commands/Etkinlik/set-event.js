const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { setEventSettings } = require('../../Models/event');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-event')
        .setDescription('Etkinlik ayarlarını yapar.')
        .addChannelOption(option => option.setName('kanal').setDescription('Etkinlik için kullanılacak kanal').setRequired(true))
        .addIntegerOption(option => option.setName('sayı').setDescription('Kazanmak için gereken sayı').setRequired(true)),
    async execute(interaction) {
        const channelId = interaction.options.getChannel('kanal').id;
        const eventNumber = interaction.options.getInteger('sayı');

        try {
            // Etkinlik ayarlarını güncelle
            await setEventSettings(channelId, null, eventNumber); // roleId şimdilik null

            // Kanal izinlerini aç
            const channel = interaction.guild.channels.cache.get(channelId);
            if (channel) {
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.SendMessages]: true // Kanala mesaj gönderme izni ver
                });

                // Botun profil fotoğrafını al
                const botAvatar = interaction.client.user.displayAvatarURL();

                // Embed mesajı oluştur
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('🎉 Etkinlik Ayarları Güncellendi! 🎉')
                    .setDescription(`Etkinlik ayarları başarıyla güncellendi.`)
                    .addFields(
                        { name: 'Kullanılacak Kanal', value: `<#${channelId}>`, inline: true },
                        { name: 'Gerekli Sayı', value: `${eventNumber}`, inline: true }
                    )
                    .setFooter({ text: 'Aniki', iconURL: botAvatar }) // Botun profil fotoğrafını ekledik
                    .setTimestamp(); // Mesajın oluşturulma zamanını ekler

                // Mesajı gönder ve sabitle
                const sentMessage = await channel.send({ 
                    embeds: [embed]
                });

                await sentMessage.pin(); // Mesajı sabitle
            } else {
                await interaction.reply('Kanal bulunamadı.');
            }
        } catch (error) {
            console.error('Etkinlik ayarlarını yaparken bir hata oluştu:', error);
            await interaction.reply('Etkinlik ayarlarını yaparken bir hata oluştu.');
        }
    },
};
