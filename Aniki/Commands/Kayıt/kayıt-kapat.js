const { Client, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt-sistemi-kapat')
        .setDescription('Kayıt sistemini kapatır ve ayarları temizler.'),
    async execute(interaction) {
        const { guild, member } = interaction;

        // Yöneticilik yetkisi kontrolü
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            const yetkiEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription("❌ | Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!");
            return interaction.reply({ embeds: [yetkiEmbed], ephemeral: true });
        }

        // Kayıt sistemi ayarlarını kontrol et
        const kayitSistemi = db.fetch(`kayıtsistemi_${guild.id}`);
        if (!kayitSistemi) {
            const bilgiEmbed = new EmbedBuilder()
                .setColor("Orange")
                .setDescription("⚠️ | Kayıt sistemi zaten kapalı veya ayarlanmamış!");
            return interaction.reply({ embeds: [bilgiEmbed], ephemeral: true });
        }

        // Kayıt sistemi ayarlarını sil
        db.delete(`kayıtsistemi_${guild.id}`);
        db.delete(`kayıtsistemiDate_${guild.id}`);

        const basariliEmbed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("✅ | Kayıt sistemi başarıyla kapatıldı ve ayarlar temizlendi!");
        
        return interaction.reply({ embeds: [basariliEmbed], ephemeral: false });
    },
};
