const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('caps-lock')
        .setDescription('Caps Clock engel sistemini açar veya kapatır.'),

    async execute(interaction) {
        // Kullanıcının gerekli izinlere sahip olup olmadığını kontrol et
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: '<a:no:1268231541524402246> | Bu komutu kullanmak için `Mesajları Yönet` iznine sahip olmalısın!', ephemeral: true });
        }

        // Caps Clock engel sistemini kontrol et
        const capsClockEngel = db.fetch(`capsclockengel_${interaction.guild.id}`);

        if (capsClockEngel) {
            // Eğer sistem açıksa, kapat
            db.delete(`capsclockengel_${interaction.guild.id}`);
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription('<a:onay:1241128947065032895> **Caps Clock Sistemi Kapatıldı** \n Büyük harf kullanımı engellenmeyecek.');
            await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } else {
            // Eğer sistem kapalıysa, aç
            db.set(`capsclockengel_${interaction.guild.id}`, true);
            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription('<a:onay:1241128947065032895> **Caps Clock Sistemi Açıldı** \n Büyük harf kullanımı kontrol edilecek ve aşırı büyük harf içeren mesajlar silinecek.');
            await interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        }
    }
};