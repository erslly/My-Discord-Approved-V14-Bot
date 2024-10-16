const { SlashCommandBuilder, PermissionsBitField } = require('discord.js'); // PermissionsBitField'ı içeri aktarın
const gameChannelSchema = require('../../Models/gameChannel'); // Bu şemayı model dosyalarınızda tanımlayın

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yt-kanal')
        .setDescription('Yazı-Tura oyunu için kanal belirler.')
        .addChannelOption(option => 
            option.setName('kanal')
                .setDescription('Oyun oynanacak kanalı seçin')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Kullanıcının admin olup olmadığını kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'Bu komutu kullanma izniniz yok.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('kanal');

        // Kanal ID'sini veritabanına kaydedin
        await gameChannelSchema.findOneAndUpdate(
            { serverId: interaction.guild.id },
            { channelId: channel.id },
            { upsert: true }
        );

        return interaction.reply({ content: `Oyun kanalı olarak ${channel} belirlendi.`, ephemeral: true });
    }
};
