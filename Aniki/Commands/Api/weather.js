const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hava-durumu')
        .setDescription('Belirtilen Şehrin Hava Durumunu Gösterir')
        .addStringOption(option =>
            option.setName('şehir')
                .setDescription('Hava Durumunu Göstermek İstediğiniz Şehrin Adını Girin')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('birim')
                .setDescription('Hava sıcaklığını hangi birimde görmek istersiniz: Celcius (Santigrat) mi yoksa Fahrenheit mi?')
                .addChoices(
                    { name: 'Celcius', value: 'C' },
                    { name: 'Fahrenheit', value: 'F' }
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        const city = interaction.options.getString('şehir');
        const unit = interaction.options.getString('birim');

        await interaction.reply({ content: ' <a:loading:1268231357717282968> Hava Durumu Bilgisi Getiriliyor... ' });

        weather.find({ search: city, degreeType: unit }, function (err, result) {
            if (err) {
                console.log(err);
                interaction.editReply({ content: `${err} | Komut Zaman Aşımına Uğradı.` });
                return;
            }
            
            if (result.length === 0) {
                interaction.editReply({ content: `${city} bölgesine ait bir hava durumu bulunamadı!` });
                return;
            }

            const current = result[0].current;
            const location = result[0].location;

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`${location.name} Bölgesinin Hava Durumu`)
                .addFields({ name: 'Derece', value: `${current.temperature}°${unit}` })
                .addFields({ name: 'Hissedilen', value: `${current.feelslike}°${unit}` })
                .addFields({ name: 'Hava', value: `${current.skytext}` })
                .addFields({ name: 'Mevcut Uyarılar', value: `${location.alert || "Uyarı Yok"}` })
                .addFields({ name: 'Gün', value: `${current.day}` })
                .addFields({ name: 'Rüzgar Hızı & Yönü', value: `${current.winddisplay}` })
                .setThumbnail(current.imageUrl);

            interaction.editReply({ content: "", embeds: [embed] });
        });
    }
};
