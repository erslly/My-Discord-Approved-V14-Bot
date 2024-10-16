const {ChannelType, ButtonInteraction, ButtonBuilder, ActionRowBuilder, EmbedBuiler, ButtonStyle, PermissionFlagsBits, PermissionOverwrites, Emoji, EmbedBuilder} = require('discord.js');
const ticketSchema = require('../../Models/Ticket');
const ticketSetup = require('../../Models/TicketSetup');
const TicketSetup = require('../../Models/TicketSetup');

module.exports =
{
    name: "interactionCreate",
    async execute(interaction, client)
    {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;

        if(!interaction.isButton()) return;
        
        const data = await TicketSetup.findOne({GuildID: guild.id})

        if(!data) return;
        if(!data.Buttons.includes(customId)) return;
        if(!guild.members.me.permissions.has(ManageChannels)) interaction.reply({content: 'Buna yetkin yok', ephemeral: true});

        try
        {
            const a = await guild.channels.create({
                name:  `${member.user.username}-${ticketId}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: data.Everyone,
                        deny: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                    {
                        id: member.id,
                        allow: [ViewChannel, SendMessages, ReadMessageHistory],
                    },
                ],
            }).then(async (channel) => {
                const newTicketSchema = await ticketSchema.create({
                    GuildID: guild.id,
                    MembersID: member.id,
                    ChannelID: channel.id,
                    TicketID: ticketId,
                    Closed: false,
                    Locked: false,
                    Type: customId,
                    Claimed: false,
                });
                
                const embed = new EmbedBuilder()
                .setTitle( `${guild.name} - Destek`)
                .addFields({name: `**Destek** talebinizle ilgilenilecektir.`, value:`${member} - ${ticketId}`, inline: true})
                .setFooter({text: `${member.user.username}`, iconURL: member.displayAvatarURL({dynamic: true})})
                .setThumbnail(client.user.displayAvatarURL());

                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('kapat').setLabel("Kapat").setStyle(ButtonStyle.Danger).setEmoji('🎫'),
                    new ButtonBuilder().setCustomId('kilitle').setLabel("Kilitle").setStyle(ButtonStyle.Secondary).setEmoji('🔒'),
                    new ButtonBuilder().setCustomId('aç').setLabel("Aç").setStyle(ButtonStyle.Success).setEmoji('🔓'),
                    new ButtonBuilder().setCustomId('talep').setLabel("İste").setStyle(ButtonStyle.Primary).setEmoji('✉️')
                );
                channel.send({
                    embeds: ([embed]),
                    components: [button]
                });
            })
            await interaction.reply({content: `${member}, desteğiniz oluşturuldu.`, ephemeral: true});
        }
        catch(err)
        {
            return console.log(err);
        }
    },
};