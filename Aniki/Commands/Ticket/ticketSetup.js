const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
const TicketSetup = require('../../Models/TicketSetup');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription("Bilet kurulumunu oluştur.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('kanal')
                .setDescription('Ticketların hangi kanalda oluşturulacağını seçiniz.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addChannelOption(option =>
            option.setName('kategori')
                .setDescription('Hangi kategoride oluşturulacağını seçiniz.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addChannelOption(option =>
            option.setName('transkript')
                .setDescription('Transkriptlerin hangi kanala gideceğini seçiniz.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Ticketları inceleyecek rolü seçiniz.')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('everyone')
                .setDescription("Herkesi '@everyone' yazarak etiketleyin.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('açıklama')
                .setDescription('Ticket için bir açıklama seçiniz.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('ilkbuton')
                .setDescription('Butonun adı')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, guild, client } = interaction;
        try {
            await interaction.deferReply({ ephemeral: true });

            const channel = options.getChannel('kanal');
            const category = options.getChannel('kategori');
            const transcripts = options.getChannel('transkript');
            const handlers = options.getRole('rol');
            const everyone = options.getRole('everyone');
            const description = options.getString('açıklama');
            const firstButton = options.getString('ilkbuton');

            await TicketSetup.findOneAndUpdate(
                { GuildID: guild.id },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,
                    Description: description,
                    Buttons: [firstButton]
                },
                {
                    new: true,
                    upsert: true,
                },
            );

            const button = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId(firstButton).setLabel(firstButton).setStyle(ButtonStyle.Secondary),
            );

            const iconURL = guild.iconURL({ dynamic: true });

            const embed = new EmbedBuilder()
                .setTitle('Destek Talebi')
                .setFooter({ text: `${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor('Random')
                .addFields({ name: `${description}`, value: `${guild.name}` });

            if (iconURL) {
                embed.setThumbnail(iconURL);
            }

            await guild.channels.cache.get(channel.id).send({
                embeds: [embed],
                components: [button]
            });

            await interaction.editReply({ content: 'Bilet başarıyla gönderildi' });

        } catch (err) {
            console.log(err);
            await interaction.editReply({ content: 'Bilet gönderilirken bir sorun oluştu.' });
        }
    }
}
