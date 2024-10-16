const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js'); // Güncellenmiş sınıf

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('🎵 | Çalma Listenizi Görüntüleyin'),

  async execute(interaction, client) {
    try {
      // Yanıtı beklet
      await interaction.deferReply().catch(err => {
        console.error('Error deferring reply:', err);
      });

      // Kuyruğu al
      const queue = client.distube.getQueue(interaction.guild.id);

      if (!queue) {
        return interaction.followUp({ content: 'There is no song currently playing.', ephemeral: true });
      }

      // Şarkı listesini oluştur
      const songs = queue.songs.map((song, index) => `${index + 1}. [${song.name}](${song.url}) - ${song.formattedDuration}`).join('\n');

      // Embed mesajı oluştur
      const embed = new EmbedBuilder()
        .setTitle('Current Music Queue')
        .setDescription(songs || 'No songs in the queue.')
        .setColor(0x0000FF); // Renk kodu (mavi) olarak hexadecimal format kullanılır

      // Yanıtı gönder
      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error('Error executing command:', error);
      if (!interaction.replied) {
        await interaction.followUp({ content: 'An error occurred while processing the command.', ephemeral: true });
      }
    }
  },
};
