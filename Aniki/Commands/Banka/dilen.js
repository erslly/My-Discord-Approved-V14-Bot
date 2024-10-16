const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const mongoose = require('mongoose');
const User = require('../../Models/user'); // Model dosyasının yolu
const config = require('../../config.json'); // config.json dosyasını içeri aktarıyoruz

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dilen')
        .setDescription('Belirli bir miktarda para dilenir.')
        .addIntegerOption(option => option.setName('miktar').setDescription('Dilenecek miktar').setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('miktar');
        const modLogChannel = interaction.client.channels.cache.get(config['logChannel']);

        if (!modLogChannel) {
            return interaction.reply({ content: 'Log kanalı bulunamadı. Kanal ID\'sini kontrol edin ve botun gerekli izinlere sahip olduğundan emin olun.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Dilenme Talebi')
            .setDescription(`Kullanıcı ${interaction.user.tag}, ${amount} dilenmek istedi.`)
            .setFooter({ text: 'Onaylamak için butonlara tıklayın.' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('onayla')
                    .setLabel('Onayla')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('redet')
                    .setLabel('Reddet')
                    .setStyle(ButtonStyle.Danger)
            );

        try {
            const message = await modLogChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: 'Talebiniz log kanalına gönderildi.', ephemeral: true });

            const filter = (i) => i.customId === 'onayla' || i.customId === 'redet';
            const collector = message.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'onayla') {
                    // Kullanıcının bakiyesini güncelle
                    try {
                        const user = await User.findOne({ id: i.user.id });
                        if (user) {
                            user.coin += amount;
                            await user.save();
                        }

                        const dmEmbed = new EmbedBuilder()
                            .setColor('#00FF00')
                            .setTitle('Talebiniz Onaylandı')
                            .setDescription(`Tebrikler! ${amount} coin talebiniz onaylandı. (Kurucu En Çok Seni Seviyor 🤤)`)
                            .setTimestamp();

                        await i.user.send({ embeds: [dmEmbed] });
                        await i.update({ content: 'Talep onaylandı ve kullanıcıya mesaj gönderildi.', components: [] });
                    } catch (error) {
                        console.error('Kullanıcı bakiyesi güncellenirken bir hata oluştu:', error);
                        await i.update({ content: 'Kullanıcı bakiyesi güncellenirken bir hata oluştu.', components: [] });
                    }
                } else if (i.customId === 'redet') {
                    await i.update({ content: 'Para Talebiniz Reddedildi Beleşten Para Kazanmak Yok 😭', components: [] });
                }
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    message.edit({ content: 'Onay süresi doldu.', components: [] });
                }
            });
        } catch (error) {
            console.error('Log kanalına mesaj gönderilirken bir hata oluştu:', error);
            await interaction.reply({ content: 'Bir hata oluştu, talebiniz gönderilemedi.', ephemeral: true });
        }
    },
};
