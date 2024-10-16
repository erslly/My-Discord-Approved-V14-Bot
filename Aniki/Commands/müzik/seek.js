const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seek')
    .setDescription('🎵 | Müzikte Belirli Bir Zaman Atlarsınız.')
    .addStringOption(option =>
      option.setName('number')
        .setDescription('İleri veya geri arama kaç saniye sürer?')
        .setRequired(true)
    ),

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

    const number = interaction.options.getString('number');
    const seekTime = parseInt(number);

    if (isNaN(seekTime)) {
      return interaction.followUp({ content: 'Please provide a valid number.', ephemeral: true });
    }

    try {
      // Müziği belirtilen süre kadar ileri veya geri sar
      queue.seek(queue.currentTime + seekTime);
      return interaction.followUp({ content: 'Successfully seeked the music.' });
    } catch (error) {
      console.error('Error seeking the music:', error);
      return interaction.followUp({ content: 'An error occurred while seeking the music.', ephemeral: true });
    }
  },
};
