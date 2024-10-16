const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('🎵 | Geçerli şarkıyı döndürür.'),

    async execute(interaction) {
        await interaction.deferReply(); // Yanıtın daha sonra gönderileceğini belirtir

        // Müzik kuyruğunu al
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.followUp('Şu anda oynatılan bir şarkı yok.');
        }

        // Kullanıcının dil tercihini al
        const language = db.fetch(`language_${interaction.user.id}`);
        
        // Şarkıyı döngüye al
        try {
            interaction.client.distube.setRepeatMode(interaction, 1); // Döngü modunu açar (1: Tek şarkıyı döngüye alır)
            await interaction.followUp('Şarkı başarıyla döngüye alındı.');
        } catch (error) {
            console.error('Döngü modunu ayarlarken bir hata oluştu:', error);
            await interaction.followUp('Döngü modunu ayarlarken bir hata oluştu.');
        }
    },
};
