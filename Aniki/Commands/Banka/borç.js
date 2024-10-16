const { SlashCommandBuilder } = require('discord.js');
const userSchema = require('../../Models/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('borç')
        .setDescription('Kullanıcının borcunu hesaplar ve kaydeder.'),
    async execute(interaction) {
        const userId = interaction.user.id;

        // Kullanıcı verilerini al
        let userData = await userSchema.findOne({ id: userId });
        if (!userData) {
            return interaction.reply({ content: 'Kullanıcı verisi bulunamadı.', ephemeral: true });
        }

        // Son borç hesaplama zamanını kontrol et
        if (userData.lastDebtCalculation) {
            const now = new Date();
            const timeDiff = now - new Date(userData.lastDebtCalculation);
            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60)); // Saat cinsinden fark

            if (hoursDiff < 48) {
                return interaction.reply({ content: `Borç hesaplama işlemini yalnızca 48 saatte bir gerçekleştirebilirsiniz. Lütfen ${48 - hoursDiff} saat bekleyin.`, ephemeral: true });
            }
        }

        // Borç hesapla (%20)
        const debt = userData.coin * 0.2;
        userData.debt = debt;
        userData.lastDebtCalculation = new Date(); // Borç hesaplama tarihini güncelle
        await userData.save();

        return interaction.reply({ content: `Borç hesaplandı. **${debt}** coin borcunuz var.`});
    },
};
