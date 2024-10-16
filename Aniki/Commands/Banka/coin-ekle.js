const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user');
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin-ekle')
        .setDescription('Belirtilen kullanıcıya coin ekler.')
        .addUserOption(option => option.setName('kullanıcı').setDescription('Coin eklemek istediğin kullanıcıyı seç').setRequired(true))
        .addIntegerOption(option => option.setName('miktar').setDescription('Eklenecek coin miktarını gir').setRequired(true)),
    
    async execute(interaction) {
        // Kullanıcının geliştirici olup olmadığını kontrol edin
        if (!config.developers.includes(interaction.user.id)) {
            return interaction.reply({ content: 'Bu komutu kullanma yetkiniz yok!', ephemeral: true });
        }

        const user = interaction.options.getUser('kullanıcı');
        let amount = interaction.options.getInteger('miktar');

        // Negatif veya sıfır miktarları engelle
        if (amount <= 0) {
            return interaction.reply({ content: 'Lütfen pozitif bir miktar giriniz!', ephemeral: true });
        }

        // Kullanıcının verilerini güncelle veya oluştur
        const userData = await userSchema.findOneAndUpdate(
            { id: user.id },
            { $inc: { coin: amount } },
            { new: true, upsert: true }
        );

        // Log kanalına mesaj gönder
        const logChannel = interaction.client.channels.cache.get(config.logChannel);
        if (logChannel) {
            logChannel.send({
                embeds: [new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('**Coin Ekleme İşlemi**')
                    .addFields(
                        { name: 'Coin Eklenen Kullanıcı', value: `<@${user.id}>`, inline: false },
                        { name: 'Ekleyen Yetkili', value: `<@${interaction.user.id}>`, inline: false },
                        { name: 'Eklenen Miktar', value: `${amount}`, inline: false },
                        { name: 'Kullanıcının Güncel Bakiye', value: `${userData.coin}`, inline: false }
                    )
                    .setTimestamp()]
            });
        }
        
        // Kullanıcıya geri bildirim
        interaction.reply({ content: `Başarıyla ${amount} coin ${user.username} kullanıcısına eklendi.`, ephemeral: true });
    }
};
