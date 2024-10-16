const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn-ayar')
    .setDescription('Uyarı ayarlarını yapılandırır.')
    .addRoleOption(option => 
      option.setName('mute-rol')
        .setDescription('Mute rolünü belirleyin')
        .setRequired(true))
    .addRoleOption(option => 
      option.setName('jail-rol')
        .setDescription('Jail rolünü belirleyin')
        .setRequired(true))
    .addRoleOption(option => 
      option.setName('mod-rol')
        .setDescription('Uyarı yetkilisini ayarlarsınız!')
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('log-kanal')
        .setDescription('Uyarıları kaydetmek için log kanalını belirleyin')
        .setRequired(true)
        .addChannelTypes(0)), // `0` kanal türü: GUILD_TEXT

  async execute(interaction) {
    // Seçilen rolleri ve kanalı al
    const muteRole = interaction.options.getRole('mute-rol');
    const jailRole = interaction.options.getRole('jail-rol');
    const modRole = interaction.options.getRole('mod-rol');
    const logChannel = interaction.options.getChannel('log-kanal');

    // Veritabanına ayarları kaydet
    db.set(`Mute_${interaction.guild.id}`, muteRole.id);
    db.set(`Jail_${interaction.guild.id}`, jailRole.id);
    db.set(`Mod_${interaction.guild.id}`, modRole.id);
    db.set(`logChannel_${interaction.guild.id}`, logChannel.id);

    // Embed mesaj oluştur
    const embed = new EmbedBuilder()
      .setColor('Aqua')
      .setTitle('Uyarı Ayarları Güncellendi')
      .setDescription('Uyarı ayarları başarıyla güncellendi.')
      .addFields(
        { name: 'Mute Rolü', value: `<@&${muteRole.id}>` },
        { name: 'Jail Rolü', value: `<@&${jailRole.id}>` },
        { name: 'Mod Rolü', value: `<@&${modRole.id}>` },
        { name: 'Log Kanalı', value: `<#${logChannel.id}>` }
      )
      .setTimestamp()
      .setFooter({ text: 'Aniki', iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 2048 }) }); // Burada bot ismini manuel olarak yazdık

    // Kullanıcıya yanıt gönder
    await interaction.reply({ embeds: [embed] });

    // Log kanalı ayarını da veritabanına kaydet
    db.set(`warnayar_${interaction.guild.id}`, logChannel.id);
  },
};
