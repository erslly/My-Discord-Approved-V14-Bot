const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('🎵 | Çalmakta olan şarkı hakkında bilgi alın.'),

    async execute(interaction) {
        await interaction.deferReply(); // Yanıtın daha sonra gönderileceğini belirtir

        // Müzik kuyruğunu al
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.followUp('Şu anda oynatılan bir şarkı yok.');
        }

        // Şarkının ilerleme çubuğunu oluştur
        const { currentTime, duration } = queue;
        const progress = Math.floor((currentTime / duration) * 20);
        const progressBar = `⬜`.repeat(progress) + '🎵' + `⬛`.repeat(20 - progress);

        // Embed mesajı oluştur
        const embed = new EmbedBuilder()
            .setColor('Purple')
            .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
            .addFields(
                { name: 'Music Author:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true },
                { name: 'Member:', value: `${queue.songs[0].user}`, inline: true },
                { name: 'Volume:', value: `${queue.volume}%`, inline: true },
                { name: 'Views:', value: `${queue.songs[0].views}`, inline: true },
                { name: 'Likes:', value: `${queue.songs[0].likes}`, inline: true },
                { name: 'Filter:', value: `${queue.filters.names.join(', ') || 'Normal'}`, inline: true },
                { name: `Video Time: **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`, value: progressBar, inline: false }
            );

        // Yanıtı gönder
        try {
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Embed gönderilirken bir hata oluştu:', error);
            await interaction.followUp('Embed gönderilirken bir hata oluştu.');
        }
    },
};
