const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🎵 | Şarkının Sesini Arttırırsınız')
    .addStringOption(option => 
      option.setName('number')
        .setDescription('Volume level (1-100)')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    // Yanıtı beklet
    await interaction.deferReply().catch(err => {
      console.error('Error deferring reply:', err);
    });

    // Ses seviyesini al
    const volumeString = interaction.options.getString('number');
    const volume = parseInt(volumeString, 10);
    const language = db.fetch(`language_${interaction.user.id}`);

    // Dil kontrolü
    if (!language) {
      // Kuyruğu al
      const queue = client.distube.getQueue(interaction.guild.id);

      if (!queue) {
        return interaction.followUp({ content: 'There is no song currently playing.', ephemeral: true });
      }

      if (isNaN(volume)) {
        return interaction.followUp({ content: 'Please provide a valid number.', ephemeral: true });
      }

      if (volume < 1) {
        return interaction.followUp({ content: 'The volume level must be at least 1.', ephemeral: true });
      }

      if (volume > 100) {
        return interaction.followUp({ content: 'The volume level must not exceed 100.', ephemeral: true });
      }

      // Ses seviyesini ayarla
      client.distube.setVolume(interaction, volume);

      return interaction.followUp({ content: `Ses Başarıyla **${volume}** Seviyesine Geçiş Yaptı.`, ephemeral: true }).catch(err => {
        console.error('Error sending message:', err);
      });
    }
  },
};
