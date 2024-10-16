const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder, ChannelType } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giriş-çıkış-kapat')
    .setDescription('Giriş ve çıkış sistemini kapatır!'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return interaction.reply({ content: "<a:no:1268231541524402246>  | Kanalları Yönet Yetkin Yok!", ephemeral: true });

    // Ayarları sıfırla
    db.delete(`hgbb_${interaction.guild.id}`);
    db.delete(`hgbb1_${interaction.guild.id}`);

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`<a:evet:1268233923721433231> | Hoşgeldin ve Görüşürüz kanalları kapatıldı!`)
      .setImage("https://i.hizliresim.com/41b2xmi.gif");

    await interaction.reply({ embeds: [embed] });
  },
};
