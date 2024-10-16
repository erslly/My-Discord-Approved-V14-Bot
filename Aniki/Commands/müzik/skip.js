const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('🎵 | Diğer Şarkıya Geçersiniz'),

  // Burada `client` parametresinin `run` fonksiyonuna geçildiğini varsayıyoruz
  async execute(interaction, client) {
    // Yanıtı beklet
    await interaction.deferReply().catch(err => {
      console.error('Error deferring reply:', err);
    });

    const queue = client.distube.getQueue(interaction.guild.id);

    if (!queue) {
      return interaction.followUp({ content: 'Şu anda çalan bir şarkı yok.', ephemeral: true });
    }

    if (queue.songs.length <= 1) {
      return interaction.followUp({ content: 'Sırada atlanacak başka şarkı yok.', ephemeral: true });
    }

    try {
      // Mevcut şarkıyı atla ve kuyruğun sonraki şarkısını çal
      client.distube.skip(interaction);
      return interaction.followUp({ content: 'Başarıyla bir sonraki şarkıya geçildi.' });
    } catch (error) {
      console.error('Error skipping the song:', error);
      return interaction.followUp({ content: 'Şarkı atlanırken bir hata oluştu.', ephemeral: true });
    }
  },
};
