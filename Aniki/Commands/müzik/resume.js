const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('🎵 | Şarkıyı Devam Ettirirsiniz'),

  // Burada `client` parametresinin `execute` fonksiyonuna geçildiğini varsayıyoruz
  async execute(interaction, client) {
    // Yanıtı beklet
    await interaction.deferReply().catch(err => {
      console.error('Error deferring reply:', err);
    });

    const queue = client.distube.getQueue(interaction.guild.id);

    if (!queue) {
      return interaction.followUp({ content: 'There is no song currently playing.', ephemeral: true });
    }

    if (!queue.paused) {
      return interaction.followUp({ content: 'The music is already playing.', ephemeral: true });
    }

    try {
      // Müziği devam ettir
      queue.resume();
      return interaction.followUp({ content: 'Successfully resumed the music.' });
    } catch (error) {
      console.error('Error resuming the music:', error);
      return interaction.followUp({ content: 'An error occurred while resuming the music.', ephemeral: true });
    }
  },
};
