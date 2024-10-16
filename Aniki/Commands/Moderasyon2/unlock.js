const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const LockSchema = require('../../Models/Lock');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Bir Kanalın Kilitlemesini Kaldırır')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const { guild, channel } = interaction;
        const embed = new EmbedBuilder();

        try {
            if (channel.permissionsFor(guild.id).has('SendMessages')) {
                return interaction.reply({
                    embeds: [embed.setColor('Red').setDescription('Bu Kanal Kiltli Değil')],
                    ephemeral: true
                });
            }

            await channel.permissionOverwrites.edit(guild.id, {
                SendMessages: null,
            });

            await LockSchema.deleteOne({ channelID: channel.id });

            interaction.reply({
                embeds: [embed.setDescription('Kilitleme İşlemi **Başarıyla** Kaldırıldı').setColor('Green')]
            });
        } catch (error) {
            console.error(error);
            interaction.reply({
                embeds: [embed.setColor('Red').setDescription('Kilitleme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.')],
                ephemeral: true
            }).catch(console.error); 
        }
    }
};
