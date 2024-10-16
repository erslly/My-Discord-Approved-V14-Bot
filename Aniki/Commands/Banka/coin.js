const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin')
        .setDescription('Bir kullanıcının coin bakiyesini gösterir.')
        .addUserOption(option => option.setName('kullanıcı').setDescription('Bakiyesini görmek istediğin kullanıcıyı seç').setRequired(false)),
    
    async execute(interaction) {
        const user = interaction.options.getUser('kullanıcı') || interaction.user;
        const userData = await userSchema.findOne({ id: user.id }).exec();

        if (!userData) {
            await userSchema.create({ id: user.id, coin: 0 });
        }

        const coinAmount = userData ? userData.coin : 0;
        const infoEmbed = new EmbedBuilder()
            .setDescription(`Güncel bakiye: **${coinAmount.toFixed()}**`)
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setColor(0x00FF00)
            .setTimestamp()
            .setFooter({
                text: interaction.client.user.username,
                iconURL: interaction.client.user.displayAvatarURL({ dynamic: true })
            });

        await interaction.reply({ embeds: [infoEmbed]});
    }
};
