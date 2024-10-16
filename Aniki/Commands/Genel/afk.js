const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const afkUsers = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('AFK olmanızı belirtir.')
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('AFK olma sebebinizi belirtin.')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.user;
        const reason = interaction.options.getString('sebep');

        afkUsers.set(user.id, reason);

        const embed = new EmbedBuilder()
            .setColor('#ffcc00')
            .setTitle('AFK Bilgilendirmesi')
            .setDescription(`${user.username} şu sebepten dolayı AFK: **${reason}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    getAfkUsers() {
        return afkUsers;
    },
};
