const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soylet')
        .setDescription('Bir mesaj yazın ve Bot Söylesin')
        .addStringOption(option => option
            .setName('mesaj')
            .setDescription('Bot Söyleyecek Mesaj')
            .setRequired(true)
        ),

    async execute(interaction) {
        const { options, channel } = interaction;
        const message = options.getString('mesaj');

        // Embed oluşturuluyor
        const embed = new EmbedBuilder()
            .setDescription(message) // Mesajı embed içinde yerleştiriyoruz
            .setColor('#00FF00') // İsteğe bağlı: Embed'in rengini belirliyoruz
            .setTimestamp(); // İsteğe bağlı: Zaman damgası ekliyoruz

        // Mesajı gönderiyoruz
        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: '<a:evet:1268233923721433231> Mesajınız embed içinde gönderildi.', ephemeral: true });
    }
};
