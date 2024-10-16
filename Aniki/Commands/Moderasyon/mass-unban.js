const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mass-unban')
        .setDescription('Belirtilen hesapları toplu olarak yasağını kaldırır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const { guild } = interaction;
        const users = await guild.bans.fetch();
        const userIds = users.map(u => u.user.id);

        if (userIds.length === 0) {
            return await interaction.reply({ content: 'Sunucuda banlanmış kullanıcı bulunamadı!', ephemeral: true });
        }

        await interaction.reply({ content: '⏰ Herkesin banı kaldırılıyor...' });


        for (const id of userIds) {
            try {
                await guild.members.unban(id);
            } catch (err) {

                console.error(`Failed to unban user with ID ${id}:`, err);
            }
        }


        const embed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`<a:evet:1268233923721433231> ${userIds.length} üyenin banı sunucudan **kaldırıldı**.`);

        await interaction.editReply({ content: '', embeds: [embed] }).catch(console.error);
    }
};
