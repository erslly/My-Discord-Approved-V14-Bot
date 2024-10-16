const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('speed')
    .setDescription('🎵 | Şarkıyı Hızlandırırsınız'),

  async execute(interaction, client) {
    // Yanıtı beklet
    await interaction.deferReply().catch(err => {
      console.error('Error deferring reply:', err);
    });

    const queue = client.distube.getQueue(interaction.guild.id);
    const language = db.fetch(`language_${interaction.user.id}`);

    if (!language) {
      if (!queue) {
        return interaction.followUp({ content: 'There is no song currently playing.', ephemeral: true });
      }

      try {
        // "nightcore" filtresini ekle
        queue.filters.add('nightcore');
        return interaction.followUp({ content: 'The song was sped up successfully.' });
      } catch (error) {
        console.error('Error applying speed filter:', error);
        return interaction.followUp({ content: 'An error occurred while applying the speed filter.', ephemeral: true });
      }
    }
  },
};
