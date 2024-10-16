const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../../config.json");
const userSchema = require('../../Models/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin-azalt')
        .setDescription('Belirtilen kullanıcının coin miktarını azaltır.')
        .addUserOption(option => option.setName('kullanıcı').setDescription('Coin miktarı azaltılacak kullanıcıyı seç').setRequired(true))
        .addIntegerOption(option => option.setName('miktar').setDescription('Azaltılacak coin miktarı').setRequired(true)),

    async execute(interaction) {
        if (!config.developers.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok!', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        const amount = interaction.options.getInteger('miktar');

        if (amount <= 0) {
            return interaction.reply({ content: 'Lütfen geçerli bir miktar belirtiniz!', ephemeral: true });
        }

        const userData = await userSchema.findOne({ id: user.id });

        if (!userData) {
            return interaction.reply({ content: 'Kullanıcının zaten bakiyesi yok!', ephemeral: true });
        }

        if (userData.coin < amount) {
            return interaction.reply({ content: `Kullanıcıdan en fazla **${userData.coin}** miktarda coin silebilirsiniz.`, ephemeral: true });
        }

        userData.coin -= amount;
        await userData.save();

        const logChannel = interaction.client.channels.cache.get(config.logChannel);
        if (logChannel) {
            const logEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('**Coin Silme İşlemi**')
                .addFields(
                    { name: 'Coini Silinen Kullanıcı', value: `<@${user.id}>`, inline: false },
                    { name: 'Silen Yetkili', value: `<@${interaction.user.id}>`, inline: false },
                    { name: 'Silinen Miktar', value: `${amount}`, inline: false },
                    { name: 'Kullanıcının Güncel Bakiye', value: `${userData.coin}`, inline: false }
                )
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
        }

        await interaction.reply({ content: 'Coin silme işlemi başarılı!', ephemeral: true });
    }
};
