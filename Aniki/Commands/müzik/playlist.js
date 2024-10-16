const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const config = require('../../config.json'); // MongoDB URL'sini içeren dosya

// MongoDB istemcisini tanımlama
const mongoClient = new MongoClient(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('🎵 | Kişisel çalma listenizi yönetin.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Çalma listenize bir şarkı ekleyin.')
        .addStringOption(option =>
          option.setName('song')
            .setDescription('Eklemek istediğiniz şarkı')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Geçerli çalma listenizi görüntüleyin.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Çalma listenizden bir şarkıyı kaldırın.')
        .addStringOption(option =>
          option.setName('song')
            .setDescription('Kaldırmak istediğiniz şarkı')
            .setRequired(true))),

  async execute(interaction) {
    const userId = interaction.user.id;
    const subcommand = interaction.options.getSubcommand();

    try {
      await mongoClient.connect();
      const database = mongoClient.db('discord_bot');
      const playlists = database.collection('playlists');

      if (subcommand === 'add') {
        const song = interaction.options.getString('song');

        // Check if playlist exists
        let playlist = await playlists.findOne({ userId });
        if (!playlist) {
          playlist = { userId, songs: [] };
        }

        if (playlist.songs.length >= 100) {
          return interaction.reply({ content: 'Çalma listeniz dolu. Yalnızca 100 şarkıya kadar ekleyebilirsiniz.', ephemeral: true });
        }

        // Simulate adding song, you should check if the song is valid by querying a music API
        if (playlist.songs.includes(song)) {
          return interaction.reply({ content: 'Bu şarkı zaten çalma listende.', ephemeral: true });
        }

        playlist.songs.push(song);
        await playlists.updateOne({ userId }, { $set: { songs: playlist.songs } }, { upsert: true });

        return interaction.reply({ content: `"${song}" Adlı Şarkı Playlistinize Eklendi` });

      } else if (subcommand === 'list') {
        const playlist = await playlists.findOne({ userId });
        if (!playlist || playlist.songs.length === 0) {
          return interaction.reply({ content: 'Çalma listeniz boş.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setTitle('Your Playlist')
          .setColor('#0099ff') // Hex renk kodu
          .setDescription(
            playlist.songs.map((song, index) => `${index + 1}. ${song}`).join('\n')
          );

        return interaction.reply({ embeds: [embed] });

      } else if (subcommand === 'remove') {
        const song = interaction.options.getString('song');
        let playlist = await playlists.findOne({ userId });
        if (!playlist || !playlist.songs.includes(song)) {
          return interaction.reply({ content: 'Bu şarkı çalma listende yok.', ephemeral: true });
        }

        playlist.songs = playlist.songs.filter(s => s !== song);
        await playlists.updateOne({ userId }, { $set: { songs: playlist.songs } });

        return interaction.reply({ content: ` "${song}" Adlı Şarkı Playlistten Çıkarıldı` });
      }
    } catch (error) {
      console.error('Error executing command:', error);
      return interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
    } finally {
      await mongoClient.close(); // Bağlantıyı kapatma
    }
  },
};
