const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user');
const gameChannelSchema = require('../../Models/gameChannel'); // Bu şemayı model dosyalarınızda tanımlayın

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yazı-tura')
        .setDescription('Yazı-Tura oyunu oynar.')
        .addIntegerOption(option =>
            option.setName('miktar')
                .setDescription('Bahis miktarını girin')
                .setRequired(true)),

    async execute(interaction) {
        const amount = interaction.options.getInteger('miktar');
        const user = interaction.user;

        // Belirlenen oyun kanalını veritabanından alın
        const gameChannelData = await gameChannelSchema.findOne({ serverId: interaction.guild.id });
        if (!gameChannelData) {
            return interaction.reply({ content: 'Oyun kanalı henüz belirlenmemiş. "/yt-kanal" yazarak belirleyebilirsiniz.', ephemeral: true });
        }

        if (interaction.channel.id !== gameChannelData.channelId) {
            return interaction.reply({ content: 'Yazı-Tura\'yı sadece belirlenen kanalda oynayabilirsiniz.', ephemeral: true });
        }

        if (amount < 1 || amount > 250000) {
            return interaction.reply({ content: 'Bahis miktarınız 1 ile 250.000 arasında olmalıdır.', ephemeral: true });
        }

        let userData = await userSchema.findOne({ id: user.id });
        if (!userData) {
            userData = await userSchema.create({ id: user.id, coin: 0 });
        }

        // Borç kontrolü
        const currentTime = new Date();
        if (userData.debt > 0 && (!userData.debtPaidUntil || userData.debtPaidUntil > currentTime)) {
            return interaction.reply({ content: `48 saat boyunca borcunuzu ödemeniz gerekiyor. Borcunuz: ${userData.debt} coin.`, ephemeral: true });
        }

        if (userData.coin < amount) {
            return interaction.reply({ content: 'Yetersiz bakiye.', ephemeral: true });
        }

        // İlk olarak "Para dönüyor..." mesajını gönder
        const initialMessage = await interaction.reply({ 
            content: `**${user.tag}** 💵 **${amount}** harcadı ve **tura** seçti\nPara dönüyor... :coin:`,
            fetchReply: true
        });

        // 1 ile 2 arasında rastgele seçim yap
        const result = Math.random() < 0.5 ? '**yazı**' : '**tura**';
        const isWinner = result === '**tura**'; // Kullanıcı "tura" seçtiği için kazananı buna göre belirle

        // Sonuçları belirle
        const winAmount = amount * 2;
        userData.coin += isWinner ? winAmount : -amount;
        await userData.save();

        // Sonuç mesajını belirle
        const resultMessage = isWinner 
            ? `Kazandınız! **${winAmount}** coin kazandınız.` 
            : `Hepsini kaybettiniz... :c`;

        // Mesajı güncelle
        await initialMessage.edit({ content: `**${user.tag}** 💵 ${amount} harcadı ve **tura** seçti\nPara dönüyor... :coin: ${resultMessage}` });
    }
};
