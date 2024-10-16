const { SlashCommandBuilder, PermissionFlagsBits, ActivityType, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Botun Durumunu Güncelleyin')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('activity')
                .setDescription('Botun Durumunu Güncelleyin')
                .addStringOption(option =>
                    option.setName('durum')
                        .setDescription('Botun Durumunu Belirtin')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Oynuyor', value: 'Oynuyor' },
                            { name: 'Yayında', value: 'Yayında' },
                            { name: 'Dinliyor', value: 'Dinliyor' },
                            { name: 'İzliyor', value: 'İzliyor' }
                        )
                )
                .addStringOption(option =>
                    option.setName('aktivite')
                        .setDescription('Mevcut Aktivitesini Belirtin')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('status')
                .setDescription('Botun Durumunu Güncelle')
                .addStringOption(option =>
                    option.setName('durum')
                        .setDescription('Botun Durumunu Belirtin')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Çevrim İçi', value: 'online' },
                            { name: 'Rahatsız Etmeyin', value: 'dnd' },
                            { name: 'Boşta', value: 'idle' },
                            { name: 'Çevrimdışı', value: 'invisible' }
                        )
                )
        ),

    async execute(interaction, client) {
        const { options } = interaction;
        const sub = options.getSubcommand();
        const type = options.getString('durum');

        try {
            if (sub === 'activity') {
                const activity = options.getString('aktivite');

                switch (type) {
                    case 'Oynuyor':
                        client.user.setActivity(activity, { type: ActivityType.Playing });
                        break;

                    case 'Yayında':
                        client.user.setActivity(activity, { type: ActivityType.Streaming });
                        break;

                    case 'Dinliyor':
                        client.user.setActivity(activity, { type: ActivityType.Listening });
                        break;

                    case 'İzliyor':
                        client.user.setActivity(activity, { type: ActivityType.Watching });
                        break;

                    default:
                        throw new Error('Geçersiz durum tipi');
                }
            } else if (sub === 'status') {
                client.user.setPresence({ status: type });
            }

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Botun Durumu Güncellendi');

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Durum güncellenirken bir hata oluştu.', ephemeral: true });
        }
    }
};
