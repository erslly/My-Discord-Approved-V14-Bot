const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu-düşür')
        .setDescription('Rastgele bir Waifu resmi gönderir.')
        .addStringOption(option =>
            option.setName('nsfw')
                .setDescription('NSFW içeriği mi? (Evet/Hayır)')
                .setRequired(false)
                .addChoices(
                    { name: 'Hayır', value: 'no' },
                    { name: 'Evet', value: 'yes' }
                )),

    async execute(interaction) {
        const isNSFW = interaction.options.getString('nsfw') === 'yes';

        try {
            // API URL'ini NSFW seçeneğine göre belirle
            const apiUrl = isNSFW
                ? 'https://api.waifu.im/search?is_nsfw=true'
                : 'https://api.waifu.im/search';

            // Waifu.im API'sinden rastgele bir Waifu verisi alın
            const response = await fetch(apiUrl);
            const data = await response.json();
            const waifu = data.images[Math.floor(Math.random() * data.images.length)];

            if (waifu) {
                const embed = new EmbedBuilder()
                    .setColor('#FFC0CB')
                    .setTitle(`İşte senin waifun ${interaction.user.username}!`)
                    .setImage(waifu.url)
                    .setTimestamp();

                // Eğer NSFW içeriği ise sadece kullanıcıya yanıt gönder
                if (isNSFW) {
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                } else {
                    await interaction.reply({ embeds: [embed] });
                }

                console.log('Waifu resmi başarıyla gönderildi.');
            } else {
                console.error('Waifu bulunamadı.');
                await interaction.reply({ content: 'Üzgünüm, Waifu bulunamadı.', ephemeral: true });
            }
        } catch (error) {
            console.error('Waifu gönderilirken bir hata oluştu:', error);
            await interaction.reply({ content: 'Waifu gönderilirken bir hata oluştu.', ephemeral: true });
        }
    },
};
