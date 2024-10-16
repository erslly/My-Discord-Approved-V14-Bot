const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const serverSettings = new Map(); // Sunucu bazında ayarları saklamak için

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sa-as')
        .setDescription('Bot Bir Kelime Yazdığınızda Size Selam Verir')
        .addStringOption(option =>
            option.setName('durum')
                .setDescription('Yanıtlamayı aç/kapat')
                .setRequired(true)
                .addChoices(
                    { name: 'Aç', value: 'aç' },
                    { name: 'Kapat', value: 'kapat' }
                )),

    async execute(interaction) {
        const user = interaction.user;
        const status = interaction.options.getString('durum');
        const guildId = interaction.guild.id;

        if (status === 'aç') {
            serverSettings.set(guildId, true);
            const embed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('Selam Yanıtlamasi!')
                .setDescription(`${user.username} Tarafından Selam Yanıtlaması Açıldı`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (status === 'kapat') {
            serverSettings.set(guildId, false);
            const embed = new EmbedBuilder()
                .setColor('#ff0000')
                .setTitle('SA-AS Yanıtlaması')
                .setDescription(`${user.username} tarafından SA-AS yanıtlaması kapatıldı.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.reply({ content: 'Geçersiz seçenek. Lütfen "aç" veya "kapat" seçeneklerinden birini kullanın.', ephemeral: true });
        }
    },

    isSaAsEnabled(guildId) {
        return serverSettings.get(guildId) || false; // Varsayılan olarak kapalı
    },
};
