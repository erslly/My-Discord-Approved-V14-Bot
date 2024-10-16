const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kanal-sil')
        .setDescription('Belirtilen kanalı siler.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Silmek İstediğiniz Kanalı Seçin.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options } = interaction;
        const channel = options.getChannel('channel') || interaction.channel;

        try {
            await channel.delete();
            await interaction.reply({ content: '<a:evet:1268233923721433231> Kanal başarıyla silindi.', ephemeral: true });
        } catch (err) {
            console.error('<a:no:1268231541524402246>  Kanal silinirken bir hata oluştu:', err);
            await interaction.reply({ content: '<a:no:1268231541524402246>  Bir hata oluştu, lütfen tekrar deneyin.', ephemeral: true });
        }
    }
};
