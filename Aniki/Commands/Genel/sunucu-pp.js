const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunucu-pp')
        .setDescription('Sunucunun avatarına bakarsın!'),

    async execute(interaction) {
        // Sunucunun avatar URL'sini al
        const avatarURL = interaction.guild.iconURL({ dynamic: true });

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setTitle(`<a:helel:1268237436937437255> ${interaction.guild.name} adlı sunucunun avatarı:`)
            .setImage(avatarURL)
            .setColor('#7289DA') // Discord mavisi
            .setFooter({ text: 'İsteyen:', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp(); // Zaman damgası ekler

        // Yanıtı gönder
        await interaction.reply({ embeds: [embed] });
    }
};
