const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji-ekle')
        .setDescription('Belirttiğiniz sunucunun emojilerini kendi sunucunuza getirin')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Kendi sunucunuza getirmek istediğiniz emojiyi seçin.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Sunucunuza eklemek istediğiniz emojinin adını girin.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member } = interaction;

        // Kullanıcının gerekli izinlere sahip olup olmadığını kontrol edin
        if (!member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return await interaction.reply({ content: 'Bu komutu kullanmaya yetkiniz yok', ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        let emoji = options.getString('emoji')?.trim();
        const name = options.getString('name');

        // Eğer emoji ID'si içeriyorsa, tam URL'yi oluşturun
        if (emoji.startsWith('<') && emoji.endsWith('>')) {
            const id = emoji.match(/\d{15,}/g)[0];

            const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(() => {
                return 'gif';
            }).catch(() => {
                return 'png';
            });

            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
        }

        // URL'nin geçerli olup olmadığını kontrol edin
        if (!emoji.startsWith('https')) {
            return await interaction.editReply({ content: 'Lütfen geçerli bir emoji girin' });
        }

        // Emoji adını doğrulama
        if (!/^[\w-]{2,32}$/.test(name)) {
            return await interaction.editReply({ content: 'Emoji adı 2-32 karakter uzunluğunda olmalı ve sadece alfanümerik karakterler veya alt çizgi (_) içermelidir.' });
        }

        // Emojiyi sunucuya eklemeye çalışın
        interaction.guild.emojis.create({ attachment: emoji, name: name })
            .then(async newEmoji => {
                const embed = new EmbedBuilder()
                    .setColor('Blurple')
                    .setDescription(`${newEmoji}, **${name}** adıyla sunucuya eklendi`);

                await interaction.editReply({ embeds: [embed] });
            })
            .catch(async err => {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription(`Emoji eklenirken bir hata oluştu: ${err.message}`);

                await interaction.editReply({ embeds: [embed], ephemeral: true });
            });
    }
};
