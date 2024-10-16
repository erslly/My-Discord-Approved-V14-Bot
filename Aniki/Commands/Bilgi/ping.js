const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Botun pingini gösterir.'),

    async execute(interaction) {
        try {
            const ping = interaction.client.ws.ping;

            const embed = new EmbedBuilder()
                .setTitle('Bot Ping')
                .setDescription(`🏓 Botun ping değeri: ${ping} ms`)
                .setColor('Random')
                .setFooter({
                    text: `İsteyen: ${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`Failed to send ping information: ${error}`);
            await interaction.reply({ content: 'Ping bilgisi alınırken bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }
    }
};
