const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('back')
        .setDescription('🎵 |Önceki Şarkıya Dönersiniz')
        .addStringOption(option => 
            option.setName('number')
                .setDescription('Ne kadar geri gitmek istersiniz? (saniye olarak)')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { client } = interaction;
        await interaction.deferReply();

        // Mevcut müzik kuyruğunu al
        const queue = client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.followUp('Şu anda oynatılan şarkı yok.');
        }

        const number = interaction.options.getString('number');
        if (isNaN(number)) {
            return interaction.followUp('Lütfen geçerli bir sayı girin!');
        }

        const seekTime = parseInt(number);
        if (seekTime <= 0 || seekTime > queue.currentTime) {
            return interaction.followUp('Geri sarma süresi geçersiz. Lütfen geçerli bir süre girin.');
        }

        // Şarkının mevcut zamanından geri sar
        queue.seek(queue.currentTime - seekTime);

        return interaction.followUp(`Şarkı ${seekTime} saniye geri sarıldı.`);
    },
};
