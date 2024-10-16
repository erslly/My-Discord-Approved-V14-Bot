const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reklam-engel')
    .setDescription('Reklam engel sistemini ayarlarsın!'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: "<a:no:1268231541524402246> | Mesajları Yönet Yetkin Yok!", ephemeral: true });
    }

    // Veritabanından reklam engel durumu kontrol edilir
    let reklam = db.fetch(`reklamengel_${interaction.guild.id}`);

    // Embed mesajları
    const embedEnable = new EmbedBuilder()
      .setDescription("<a:onay:1241128947065032895> **Sistem Açıldı** \n Reklam algılandığında mesaj silinecek ve kullanıcı uyarılacak.")
      .setColor('Green');

    const embedDisable = new EmbedBuilder()
      .setDescription("<a:onay:1241128947065032895> **Sistem Kapatıldı** \n Reklam algılandığında mesaj silinmeyecek.")
      .setColor('Red');

    // Eğer reklam engel sistemi açık ise kapatır
    if (reklam) {
      db.delete(`reklamengel_${interaction.guild.id}`);
      await interaction.reply({ embeds: [embedDisable], allowedMentions: { repliedUser: false } });
    } else {
      // Eğer reklam engel sistemi kapalı ise açar
      db.set(`reklamengel_${interaction.guild.id}`, true);
      await interaction.reply({ embeds: [embedEnable], allowedMentions: { repliedUser: false } });
    }
  }
};