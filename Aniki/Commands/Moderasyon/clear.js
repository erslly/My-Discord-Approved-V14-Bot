const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sil")
        .setDescription('Belirttiğin Sayı Kadar Mesaj Sil')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName("sayı")
                .setDescription("Silmek İstediğin Mesaj Sayısı")
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, channel } = interaction;
        const amount = options.getInteger("sayı");

        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return await interaction.reply({ content: 'Bu Komutu Kullanmaya Yetkiniz Yok! Mesajları Yönet Yetkisine Sahip Olmanız Gerekiyor.', ephemeral: true });
        }

        if (!amount) {
            return await interaction.reply({ content: 'Silinecek mesaj sayısınızı giriniz', ephemeral: true });
        }

        if (amount > 100 || amount < 1) {
            return await interaction.reply({ content: 'Silinecek mesaj sayısı 1 ila 100 arasında olmalıdır.', ephemeral: true });
        }

        try {
            await channel.bulkDelete(amount);

            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setDescription(`<a:evet:1268233923721433231> ${amount} mesaj silindi.`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
            return await interaction.reply({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', ephemeral: true });
        }
    }
};
