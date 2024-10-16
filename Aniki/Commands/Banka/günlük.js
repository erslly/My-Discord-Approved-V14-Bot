const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user'); // Şema dosyanızda tanımlayın

module.exports = {
    data: new SlashCommandBuilder()
        .setName('günlük')
        .setDescription('Günlük ödülünüzü alın.'),

    async execute(interaction) {
        const user = interaction.user;
        const now = new Date();
        const twelveHoursInMillis = 1000 * 60 * 60 * 12;

        try {
            // Kullanıcı verisini al
            let userData = await userSchema.findOne({ id: user.id });

            if (!userData) {
                // Kullanıcı verisi yoksa oluştur ve ödül ver
                userData = new userSchema({
                    id: user.id,
                    coin: 1000,  // İlk defa komutu kullanan kullanıcıya 1000 coin ver
                    lastDaily: now
                });

                // Kullanıcı verisini kaydet
                await userData.save();

                const rewardEmbed = new EmbedBuilder()
                    .setColor("#00ff00")
                    .setTitle('Günlük Ödülünüz')
                    .setDescription('İlk defa komutu kullandınız ve **1000** coin kazandınız!')
                    .setTimestamp();

                return await interaction.reply({ embeds: [rewardEmbed] });
            }

            const lastDaily = userData.lastDaily ? new Date(userData.lastDaily) : null;

            // Son ödülden beri geçen süreyi hesapla
            if (lastDaily) {
                const timeSinceLastDaily = now - lastDaily;
                if (timeSinceLastDaily < twelveHoursInMillis) {
                    const nextRewardTime = new Date(lastDaily.getTime() + twelveHoursInMillis);

                    const countdownEmbed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle('Günlük Ödül')
                        .setDescription(`Günlük ödülünüzü almak için **<t:${parseInt(nextRewardTime / 1000)}:R>** beklemeniz gerekiyor.`)
                        .setTimestamp();

                    return await interaction.reply({ embeds: [countdownEmbed] });
                }
            }

            // Günlük ödülü ver
            const reward = 1000; // Sabit ödül miktarı
            userData.coin += reward;
            userData.lastDaily = now; // Son ödül tarihini güncelle

            // Kullanıcı verisini güncelle
            await userData.save();

            const rewardEmbed = new EmbedBuilder()
                .setColor("#00ff00")
                .setTitle('Günlük Ödülünüz')
                .setDescription(`Bugün **${reward}** coin kazandınız! Toplam bakiye: **${userData.coin}** coin.`)
                .setTimestamp();

            await interaction.reply({ embeds: [rewardEmbed] });

        } catch (err) {
            console.error('Bir hata oluştu:', err);
            await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
        }
    }
};
