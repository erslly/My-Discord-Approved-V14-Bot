const { PermissionsBitField, EmbedBuilder, SlashCommandBuilder, ChannelType } = require("discord.js");
const db = require("croxydb");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giriş-çıkış')
    .setDescription('Giriş çıkış sistemini ayarlarsınız!')
    .addChannelOption(option =>
      option.setName('giriskanal')
        .setDescription('Giriş kanalı ayarlarsınız!')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addChannelOption(option =>
      option.setName('cikiskanal')
        .setDescription('Çıkış kanalı ayarlarsınız!')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return interaction.reply({ content: "<a:no:1268231541524402246>  | Kanalları Yönet Yetkin Yok!", ephemeral: true });

    const girisKanal = interaction.options.getChannel("giriskanal");
    db.set(`hgbb_${interaction.guild.id}`, { channel: girisKanal.id });

    const cikisKanal = interaction.options.getChannel("cikiskanal");
    db.set(`hgbb1_${interaction.guild.id}`, { channel: cikisKanal.id });

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`<a:evet:1268233923721433231> | Hoşgeldin kanalı <#${girisKanal.id}> ve Görüşürüz kanalı <#${cikisKanal.id}> olarak ayarlandı!`)
      .setImage("https://i.hizliresim.com/41b2xmi.gif");

    await interaction.reply({ embeds: [embed] });
  },
};
