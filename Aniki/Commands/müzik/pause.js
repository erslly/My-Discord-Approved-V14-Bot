const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('🎵 | Müziği Durdurursunuz'),

  // Burada `client` parametresinin `run` fonksiyonuna geçildiğini varsayıyoruz
  async execute(interaction, client) {
    // Yanıtı beklet
    await interaction.deferReply().catch(err => {
      console.error('Error deferring reply:', err);
    });

    const queue = client.distube.getQueue(interaction.guild.id);

    if (!queue) {
      return interaction.followUp({ content: 'There is no song currently playing.', ephemeral: true });
    }

    if (queue.paused) {
      return interaction.followUp({ content: 'The music is already paused.', ephemeral: true });
    }

    try {
      // Müziği duraklat
      queue.pause();
      return interaction.followUp({ content: 'Successfully paused the music.' });
    } catch (error) {
      console.error('Error pausing the music:', error);
      return interaction.followUp({ content: 'An error occurred while pausing the music.', ephemeral: true });
    }
  },
};
