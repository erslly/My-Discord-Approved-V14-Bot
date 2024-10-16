const { SlashCommandBuilder } = require('@discordjs/builders');
const db = require('croxydb'); // Veritabanı işlemleri için

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bass')
        .setDescription('🎵 | Bass boost'),

    async execute(interaction) {
        await interaction.deferReply();

        // Müzik kuyruğunu al
        const queue = interaction.client.distube.getQueue(interaction);
        if (!queue) {
            return interaction.followUp('Şu anda oynatılan şarkı yok.');
        }

        // Kullanıcının dil tercihini kontrol et
        const language = db.fetch(`language_${interaction.user.id}`);
        const successMessage = language === 'en' ? 'The song has been boosted successfully.' : 'Şarkıya bass boost eklendi.';

        // Bass boost filtresini ekle
        try {
            // Filtreler eklenmeden önce mevcut filtreleri al
            const filters = queue.filters;
            
            // Bass boost filtresi zaten varsa, kaldır
            if (filters.has('bassboost')) {
                queue.filters.remove('bassboost');
                return interaction.followUp(successMessage);
            }

            // Bass boost filtresi yoksa, ekle
            queue.filters.add('bassboost');
            await interaction.followUp(successMessage);
        } catch (error) {
            console.error('Bass boost eklenirken bir hata oluştu:', error);
            await interaction.followUp('Bass boost eklenirken bir hata oluştu.');
        }
    },
};
