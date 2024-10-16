const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('force-ban')
        .setDescription('ID ile kullanıcı yasaklarsın!')
        .addStringOption(option => 
            option.setName('id')
                .setDescription('Lütfen bir kullanıcı ID girin!')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: '<a:no:1268231541524402246> | Üyeleri Yasakla Yetkin Yok!', ephemeral: true });
        }

        const id = interaction.options.getString('id');

        try {
            await interaction.guild.members.ban(id);
            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`<a:evet:1268233923721433231> ${id}  | ID\'li kullanıcı başarıyla yasaklandı!`);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            let errorMessage = '<a:no:1268231541524402246> | Kullanıcı yasaklanırken bir hata oluştu!';
            if (error.code === 50013) {
                errorMessage = '<a:no:1268231541524402246> | Kullanıcıyı yasaklamak için yeterli yetkim yok!';
            } else if (error.code === 10013) {
                errorMessage = '<a:no:1268231541524402246> | Geçersiz kullanıcı ID\'si!';
            }

            const errorEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(errorMessage);
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
