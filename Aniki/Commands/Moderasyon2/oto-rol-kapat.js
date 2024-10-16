const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oto-rol-kapat')
        .setDescription('Oto-Rol Sistemini kapatır!'),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: '<a:no:1268231541524402246> | Rolleri Yönet Yetkin Yok!', ephemeral: true });
        }

        try {
            db.delete(`otorol_${interaction.guild.id}`);
        } catch (error) {
            console.error(`Oto-rol veritabanından silinirken bir hata oluştu: ${error}`);
            await interaction.followUp({ content: '<a:no:1268231541524402246> | Oto-rol veritabanından silinirken bir hata oluştu.', ephemeral: true });
        }

        try {
            db.delete(`botrol_${interaction.guild.id}`);
        } catch (error) {
            console.error(`Bot rolü veritabanından silinirken bir hata oluştu: ${error}`);
            await interaction.followUp({ content: '<a:no:1268231541524402246> | Bot rolü veritabanından silinirken bir hata oluştu.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription('<a:evet:1268233923721433231> | Oto-rol başarıyla kapatıldı.');

        try {
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`Yanıt gönderilirken bir hata oluştu: ${error}`);
        }
    },
};
