const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Botun Komutlarını Listeler'),

    async execute(interaction) {
        const emojis = {
            bilgi: 'ℹ️', 
            banka: '🏦',
            genel: '👤', 
            moderasyon: '🔨', 
            moderasyon2: '🔨',
            roller: '🎭', 
            seviye: '🆙', 
            eğlence: '🎉', 
            müzik: '🎵',
            api: '🤖',
            çekiliş: '🎉',
            etkinlik: '📅',
            ticket: '🎟️'
        };

        await interaction.deferReply({ ephemeral: false });

        try {
            const directories = [...new Set(interaction.client.commands.map((cmd) => cmd.folder))];

            const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

            const categories = directories.map((dir) => {
                const getCommands = interaction.client.commands
                    .filter((cmd) => cmd.folder === dir)
                    .map((cmd) => ({
                        name: cmd.data.name,
                        description: cmd.data.description || 'Bu komut için açıklama yok.',
                    }));

                return {
                    directory: formatString(dir),
                    commands: getCommands,
                };
            });

            const embed = new EmbedBuilder().setDescription("Bir Kategori Seçiniz");

            const components = (state) => [
                new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help-menu')
                        .setPlaceholder('Kategori Seçiniz')
                        .setDisabled(state)
                        .addOptions(
                            categories.map((cmd) => ({
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `${cmd.directory} Kategorisindeki komutlar`,
                                emoji: emojis[cmd.directory.toLowerCase()] || '❓',
                            }))
                        )
                ),
            ];

            const initialMessage = await interaction.editReply({ embeds: [embed], components: components(false) });

            const filter = (i) => i.user.id === interaction.user.id;

            const collector = interaction.channel.createMessageComponentCollector({
                filter,
                componentType: ComponentType.StringSelect,
                time: 60000,
            });

            collector.on('collect', async (i) => {
                try {
                    const [directory] = i.values;
                    const category = categories.find((x) => x.directory.toLowerCase() === directory);

                    const categoryEmbed = new EmbedBuilder()
                        .setTitle(`${formatString(directory)}`)
                        .addFields(
                            category.commands.map((cmd) => ({
                                name: `\`${cmd.name}\``,
                                value: cmd.description,
                                inline: true,
                            }))
                        );

                    await i.update({ embeds: [categoryEmbed] });
                } catch (error) {
                    console.error('Error in collector.on collect:', error);
                    await i.update({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', embeds: [], components: [] });
                }
            });

            collector.on('end', async () => {
                try {
                    await initialMessage.edit({ components: components(true) });
                } catch (error) {
                    console.error('Error in collector.on end:', error);
                }
            });
        } catch (error) {
            console.error('Error in execute:', error);
            await interaction.editReply({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', embeds: [], components: [] });
        }
    },
};
