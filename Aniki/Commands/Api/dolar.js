const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dolar')
        .setDescription('Güncel dolar kuru bilgisini getirir.'),
    async execute(interaction) {
        try {
            // Dolar bilgilerini API'den al
            const response = await axios.get('https://tilki.dev/api/dolar');
            const data = response.data;

            // Dolar bilgilerini formatla
            const dolarKuru = data.dolar;

            // API zaman damgasını saniye cinsine çevir
            const zaman = data.zaman; // Eğer API zamanı zaten saniye cinsindense bu satırı kullanın
            // const zaman = Math.floor(data.zaman / 1000); // Eğer API zamanı milisaniye cinsindense bu satırı kullanın

            // Embed mesajı oluştur
            const embed = new EmbedBuilder()
                .setColor('#00BFFF') // Mavi renk
                .setTitle('Güncel Dolar Kuru Bilgisi')
                .setDescription(`**Dolar Kuru:** ${dolarKuru} TL\n**Zaman:** <t:${zaman}:F>`)
                .setTimestamp()
                .setFooter({ text: `Aniki Dolar Sistemi`, iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 2048 }) });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('API hatası:', error);
            await interaction.reply({ content: 'Dolar bilgileri alınırken bir hata oluştu.' });
        }
    },
};
