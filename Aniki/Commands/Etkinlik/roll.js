const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { getEventSettings } = require('../../Models/event');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Rastgele bir sayı atar ve etkinlikteki sayıyı tutturmaya çalışır.'),
    async execute(interaction) {
        const eventSettings = await getEventSettings();

        if (!eventSettings) {
            // Etkinlik ayarları yapılmamışsa kullanıcıya bilgi ver
            return interaction.reply('Etkinlik ayarlanmamış. Lütfen `/set-event` komutunu kullanarak etkinliği ayarlayın.');
        }

        const { eventNumber, channelId } = eventSettings;
        const userRoll = Math.floor(Math.random() * eventNumber) + 1; // 1 ile eventNumber arasında rastgele bir sayı

        // Geçerli kanal kontrolü
        if (interaction.channel.id !== channelId) {
            return interaction.reply('Bu komutu sadece etkinlik için belirlenen kanalda kullanabilirsiniz.');
        }

        // İlk olarak "Zar dönüyor..." mesajını gönder
        const initialMessage = await interaction.reply({ content: '<a:loading:1268231357717282968> Zar dönüyor...', fetchReply: true });

        // Embed mesajını oluştur
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Etkinlik Sonucu')
            .setDescription(`**${interaction.user.tag}** rastgele bir sayı attı.`)
            .addFields(
                { name: '<a:next:1268240382169190515> Atılan Sayı', value: userRoll.toString(), inline: true },
                { name: '<a:next:1268240382169190515> Gerekli Sayı', value: eventNumber.toString(), inline: true }
            )
            .setFooter({ text: 'Aniki', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp(); // Mesajın oluşturulma zamanını ekler

        if (userRoll === eventNumber) {
            const channel = interaction.guild.channels.cache.get(channelId);
            if (channel) {
                // Embed mesajını gönder
                await initialMessage.edit({ content: '', embeds: [embed] });

                // Tebrik mesajı gönder
                await channel.send(`Tebrikler ${interaction.user}, ${eventNumber} sayısını tutturdunuz! <a:zip:1270080004914413629>`);

                // Kanalı kilitle
                await channel.permissionOverwrites.edit(interaction.guild.id, {
                    [PermissionsBitField.Flags.SendMessages]: false
                });
            } else {
                console.error('Kanal bulunamadı.');
            }
        } else {
            // Eğer sayı tutturulmadıysa sadece embed mesajını gönder
            await initialMessage.edit({ content: '', embeds: [embed] });
        }
    },
};
