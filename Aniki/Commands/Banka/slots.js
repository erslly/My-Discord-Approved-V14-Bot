const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slots')
        .setDescription('Slot oyununu başlatır.')
        .addIntegerOption(option =>
            option.setName('bahis')
                .setDescription('Slot oyunu için bahis miktarını girin')
                .setRequired(true)),

    async execute(interaction) {
        const bet = interaction.options.getInteger('bahis');
        const user = interaction.user;

        if (bet <= 0) {
            return interaction.reply({ content: 'Geçersiz bahis miktarı. Bahis pozitif bir sayı olmalıdır.', ephemeral: true });
        }

        try {
            // Kullanıcı verisini al
            let userData = await userSchema.findOne({ id: user.id });
            if (!userData) {
                userData = await userSchema.create({ id: user.id, coin: 0 });
            }

            // Borç kontrolü
            const currentTime = new Date();
            if (userData.debt > 0 && (!userData.debtPaidUntil || userData.debtPaidUntil > currentTime)) {
                return interaction.reply({ content: `48 saat boyunca borcunuzu ödemeniz gerekiyor. Borcunuz: ${userData.debt} coin.`, ephemeral: true });
            }

            // Yetersiz bakiye kontrolü
            if (userData.coin < bet) {
                return interaction.reply({ content: 'Yetersiz bakiye.', ephemeral: true });
            }

            // Bahis miktarını güncelle ve başlangıç mesajını gönder
            userData.coin -= bet;
            await userData.save();

            const symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓'];
            const spinning = ['🍒', '🍋', '🍊', '🍉', '🍇', '🍓'];

            const initialEmbed = new EmbedBuilder()
                .setColor("#000000")
                .setTitle('Slot Oyunu Başlıyor!')
                .setDescription(`Slot sembollerinin dönmesini izleyin...`)
                .setTimestamp();

            const initialMessage = await interaction.reply({ embeds: [initialEmbed] });

            // Animasyonlu semboller için geçici güncellemeler
            for (let i = 0; i < 10; i++) {
                const spinResult = Array.from({ length: 3 }, () => spinning[Math.floor(Math.random() * spinning.length)]);
                const spinningEmbed = new EmbedBuilder()
                    .setColor("#000000")
                    .setTitle('Slot Oyunu')
                    .setDescription(`Dönüyor...\n${spinResult.join(' | ')}`)
                    .setTimestamp();

                await initialMessage.edit({ embeds: [spinningEmbed] });
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 saniye bekle
            }

            // Sonuçları belirle
            const result = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]);
            const isWin = result.every(symbol => symbol === result[0]);
            const winAmount = isWin ? bet * 2 : 0;

            // Kullanıcı bakiyesini güncelle
            userData.coin += winAmount;
            await userData.save();

            // Sonuç embed mesajını oluştur
            const resultEmbed = new EmbedBuilder()
                .setColor(isWin ? "#00ff00" : "#ff0000")
                .setTitle('Slot Oyunu Sonucu')
                .setDescription(`Sonuç: ${result.join(' | ')}\n\n${isWin ? `Tebrikler! **${winAmount}** Coin Kazandınız!` : `Üzgünüm, kaybettiniz.`}`)
                .setTimestamp();

            await initialMessage.edit({ embeds: [resultEmbed] });

        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
        }
    }
};
