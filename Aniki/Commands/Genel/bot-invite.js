const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, OAuth2Scopes, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-davet')
        .setDescription('Botun davet linkini gösterir.')
        .addStringOption(option =>
            option.setName('permissions')
                .setDescription('Ekleyeceğin Botun İzinleri')
                .setRequired(true)
                .addChoices(
                    { name: 'Sunucuyu Görüntüleme (Moderatörlük Yok)', value: '517547088960' },
                    { name: 'Düşük Moderatörlük', value: '545195949136' },
                    { name: 'Üst Düzey Moderatörlük', value: '545195949174' },
                    { name: 'Yönetici', value: '8' }
                )
        ),

    async execute(interaction) {
        const { options, client } = interaction;
        const perms = options.getString('permissions');

        const link = client.generateInvite({
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: new PermissionsBitField(BigInt(perms))
        });

        const embed = new EmbedBuilder()
            .setColor('Green');

        if (perms !== '8') {
            embed.setDescription(`<a:evet:1268233923721433231> Seçtiğin İzinleri Kullanarak Botun Davet Linkini Oluşturdum. \n\n <a:HaraketliEmoji44:1258240396157517878> Botun Tüm Fonksiyonlarına Erişebilmek İçin **Yönetici** İzni Gerekebilir \n\n ${link}`);
        } else {
            embed.setDescription(`<a:evet:1268233923721433231> Seçtiğin İzinleri Kullanarak Botun Davet Linkini Oluşturdum. \n\n ${link}`);
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
