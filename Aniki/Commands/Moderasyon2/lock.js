const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const LockSchema = require('../../Models/Lock');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Bir Kanalı Kilitler')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Belirli Bir Zaman Kilitle: (1m, 1h, 1d)')
        .setRequired(false)
    )
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Kilitleme Nedeni')
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const { guild, channel, options } = interaction;

      const reason = options.getString('reason') || '(Neden Belirtilmedi)';
      const time = options.getString('time');

      const embed = new EmbedBuilder();

      if (!channel.permissionsFor(guild.id).has("SendMessages")) {
        return interaction.reply({ embeds: [embed.setColor('Red').setDescription("Bu Kanal Zaten Kilitli")], ephemeral: true });
      }

      try {
        await channel.permissionOverwrites.edit(guild.id, {
          SendMessages: false,
        });

        interaction.reply({ embeds: [embed.setColor('Red').setDescription(`Bu Kanal (${reason}) nedeniyle kilitli: ${time || 'süresiz'}`)], ephemeral: true });
      } catch (e) {
        console.error('Kanal kilitlenirken hata oluştu:', e);
        interaction.reply({ content: 'Kanalı kilitlemek için gerekli izinlere sahip değilim.', ephemeral: true });
      }

      if (time) {
        const ExpireDate = Date.now() + ms(time);
        await LockSchema.create({
          guildID: guild.id,
          channelID: channel.id,
          Time: ExpireDate,
        });

        setTimeout(async () => {
          try {
            await channel.permissionOverwrites.edit(guild.id, {
              SendMessages: null,
            });

            await interaction.followUp({ embeds: [embed.setColor('Green').setDescription(`Bu Kanalda (${reason}) nedeniyle ${time} olan kilitleme işlemi kaldırıldı.`)], ephemeral: true }).catch(() => {});

            await LockSchema.deleteOne({ channelID: channel.id });
          } catch (e) {
            console.error('Kanal kilidi açılırken hata oluştu:', e);
          }
        }, ms(time));
      }
    } catch (e) {
      console.error('Lock komutu çalıştırılırken hata oluştu:', e);
      await interaction.followUp({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', ephemeral: true });
    }
  }
};
