const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('liderlik-tablosu')
        .setDescription('Liderlik Tablosunu Görüntüle'),

    async execute(interaction) {
        const { guildId, client } = interaction;
        const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);

        try {
            if (rawLeaderboard.length < 1) return interaction.reply("Liderlik tablosunda herhangi bir üye bulunamadı.");

            const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);
            const lb = leaderboard.map(e => `**${e.position}. ${e.username}#${e.discriminator}** - Seviye: **${e.level}** - XP: **${e.xp.toLocaleString()}**`);

            const embed = new EmbedBuilder()
                .setTitle('Liderlik Tablosu')
                .setDescription(lb.join('\n\n'))
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);
            return interaction.reply({ content: "Bu işlemi gerçekleştiremiyorum. Lütfen daha sonra tekrar deneyin." });
        }
    }
};
