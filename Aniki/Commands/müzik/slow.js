const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slow')
    .setDescription('🎵 | Şarkıyı Yavaşlatırsınız'),

  // Burada `client` parametresinin `run` fonksiyonuna geçildiğini varsayıyoruz
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
        // "vaporwave" filtresini ekle
        queue.filters.add('vaporwave');
        return interaction.followUp({ content: 'The song was successfully slowed down.' });
      } catch (error) {
        console.error('Error applying slow filter:', error);
        return interaction.followUp({ content: 'An error occurred while applying the slow filter.', ephemeral: true });
      }
    }
  },
};
