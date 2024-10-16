const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kurucu-kim")
    .setDescription("Sunucunun kurucusunu görürsün!"),

  async execute(interaction) {
    const owner = await interaction.guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor("#FF4500") // Daha dikkat çekici bir renk
      .setTitle("💍 Sunucunun Kurucusu")
      .setDescription(`👑 **Kurucu:** <@${owner.user.id}>`)
      .addFields(
        { name: "Kurucu Kullanıcı Adı", value: `${owner.user.tag}`, inline: true },
        { name: "Kurucu ID", value: `${owner.user.id}`, inline: true },
        { name: "Sunucu Kuruluş Tarihi", value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}:R>`, inline: true }
      )
      .setThumbnail(owner.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Kurucu Bilgileri", iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
