const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction, InteractionType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('🎵 | Bir şarkı çalın!')
        .addStringOption(option =>
            option
                .setName('song')
                .setDescription('Şarkının adı veya URL')
                .setRequired(true)
        ),
    /**
     * Executes the play command.
     * @param {CommandInteraction} interaction - The command interaction.
     * @param {import('discord.js').Client} client - The Discord client.
     */
    async execute(interaction, client) {
        if (interaction.type !== InteractionType.ApplicationCommand) return;

        await interaction.deferReply().catch(console.error);

        const song = interaction.options.getString('song');
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.followUp('Bir ses kanalında olmanız gerekiyor!');
        }

        try {
            await client.distube.play(voiceChannel, song, {
                textChannel: interaction.channel,
                member: interaction.member,
            });
            interaction.followUp(`🎶 | **${song}** oynatılıyor!`);
        } catch (error) {
            console.error('Error playing song:', error);
            interaction.followUp('Şarkıyı oynatırken bir hata oluştu.');
        }
    },
};
