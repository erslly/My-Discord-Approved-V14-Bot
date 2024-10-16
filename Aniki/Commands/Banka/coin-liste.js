const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user'); // Bu şemayı model dosyalarınızda tanımlayın

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coin-liste')
        .setDescription('Sunucudaki kullanıcıların coin listesini gösterir.'),

    async execute(interaction) {
        try {
            // Veritabanından kullanıcıları al
            const data = await userSchema.find({}).exec();
            
            // Kullanıcıları coin miktarına göre sırala ve ilk 15 tanesini al
            const topUsers = data
                .sort((a, b) => Number(b.coin) - Number(a.coin))
                .slice(0, 15);
            
            // Embed mesajını oluştur
            const infoEmbed = new EmbedBuilder()
                .setTitle('Top 15 Coin Listesi')
                .setDescription(topUsers
                    .map((user, index) => 
                        `\`${index + 1}.\` <@${user.id}> \`${user.coin.toLocaleString()}\``
                    )
                    .join('\n'))
                .setColor("#00ff00")
                .setTimestamp();
            
            // Yanıtı gönder
            await interaction.reply({ embeds: [infoEmbed] });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Veritabanı hatası oluştu.', ephemeral: true });
        }
    }
};
