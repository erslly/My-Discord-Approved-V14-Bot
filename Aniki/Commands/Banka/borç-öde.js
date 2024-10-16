const { SlashCommandBuilder } = require('discord.js');
const userSchema = require('../../Models/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('borç-öde')
        .setDescription('Kullanıcının borcunu öder.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Kullanıcı verilerini al
        let userData = await userSchema.findOne({ id: userId });
        if (!userData) {
            return interaction.reply({ content: 'Kullanıcı verisi bulunamadı.', ephemeral: true });
        }

        if (userData.debt === 0) {
            return interaction.reply({ content: 'Borç bulunmuyor.', ephemeral: true });
        }

        if (userData.coin < userData.debt) {
            return interaction.reply({ content: 'Yetersiz bakiye, borcunuzu ödeyebilmek için yeterli coininiz yok.', ephemeral: true });
        }

        // Borcu öde
        const debtAmount = userData.debt;
        userData.coin -= debtAmount;
        userData.debt = 0;
        await userData.save();

        return interaction.reply({ content: `Borç ödendi. **${debtAmount}** coin borcunuz vardı ve **${debtAmount}** coin ödendi.`});
    },
};
