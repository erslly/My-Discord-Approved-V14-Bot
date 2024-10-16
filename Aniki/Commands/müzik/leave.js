const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('🎵 | Bot Sesli Kanaldan Ayrılır'),

    async execute(interaction) {
        await interaction.deferReply();

        // Müzik kuyruğunu al
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.followUp('Şu anda oynatılan şarkı yok.');
        }

        // Botun ses kanalından çıkmasını sağla
        try {
            // Botun ses kanalından çıkmasını sağlar
            interaction.client.distube.voices.leave(interaction.guild.id);

            // Kuyruğu temizle ve veritabanından müzik bilgilerini sil
            db.delete(`music_${interaction.guild.id}`);

            await interaction.followUp('Bot ses kanalından ayrıldı ve müzik kuyruğu temizlendi.');
        } catch (error) {
            console.error('Ses kanalından çıkarken bir hata oluştu:', error);
            await interaction.followUp('Ses kanalından çıkarken bir hata oluştu.');
        }
    },
};
