const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');
const { profileImage } = require('discord-arts');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Birinin Seviyesi Hakkında Bilgi Al')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Bir Üye Seç')
                .setRequired(false)
        ),

    async execute(interaction, client) {
        const { options, guildId, user } = interaction;

        const member = options.getMember('user') || user;

        await interaction.deferReply();

        const LevelsUser = await Levels.fetch(member.id, guildId);

        if (!LevelsUser) {
            return interaction.followUp({ content: 'Görünüşe Göre Bu Üye Daha Önce Hiç xp Kazanmamış', ephemeral: true });
        }

        var xpRequired = Levels.xpFor(LevelsUser.level + 1);

        const rawLeaderboard = await Levels.fetchLeaderboard(guildId, 10);
        const leaderboard = await Levels.computeLeaderboard(client, rawLeaderboard, true);

        const buffer = await profileImage(member.id, {
            borderColor: ['#000000', '#ffffff'],
            badgesFrame: true,
            usernameColor: '#d402e0',

            customBackground: 'https://png.pngtree.com/thumb_back/fw800/background/20230518/pngtree-the-manga-couple-of-anime-i-love-you-in-autumn-image_2579703.jpg',
            squareAvatar: true,
            rankData: {
                currentXp: LevelsUser.xp,
                requiredXp: xpRequired,
                level: LevelsUser.level,
                barColor: "#0aa7f0",
            }
        });

        const img = new AttachmentBuilder(buffer, { name: 'rank.png' });

        return interaction.followUp({ files: [img] });
    }
};
