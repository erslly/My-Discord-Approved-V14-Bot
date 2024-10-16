const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deprem-bilgi')
        .setDescription('Son 5 deprem bilgisini getirir.'),
    async execute(interaction) {
        try {
            // Deprem verilerini API'den al
            const response = await axios.get('https://deprem.tilki.dev/');
            const data = response.data;

            // Son 5 deprem bilgisini al
            const last5Earthquakes = data.slice(-5);

            // Embed mesajı oluştur
            const embed = new EmbedBuilder()
                .setColor('#FF4500')  // Turuncu renk
                .setTitle('Son 5 Deprem Bilgisi')
                .setTimestamp()
                .setFooter({ text: `Aniki Deprem Bilgi Sistemi`, iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 2048 }) });

            last5Earthquakes.forEach(eq => {
                // Her bir deprem bilgisini tek bir field olarak ekleyin
                embed.addFields({
                    name: `Deprem: ${eq.tarih} ${eq.saat}`,
                    value: `**Enlem:** ${eq.enlem}\n` +
                           `**Boylam:** ${eq.boylam}\n` +
                           `**Derinlik:** ${eq.derinlik} km\n` +
                           `**Büyüklük:** ${eq.buyukluk}\n` +
                           `**Yer:** ${eq.yer}\n` +
                           `**Şehir:** ${eq.sehir || 'Belirtilmemiş'}`,
                    inline: false
                });
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('API hatası:', error);
            await interaction.reply({ content: 'Deprem bilgileri alınırken bir hata oluştu.' });
        }
    },
};
