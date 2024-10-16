const { ButtonInteraction, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const TicketSetup = require('../../Models/TicketSetup');
const TicketSchema = require('../../Models/Ticket');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction) {
        if (!interaction.isButton()) return;

        const { guild, member, customId, channel } = interaction;

        if (!["kapat", "kilitle", "aç", "talep"].includes(customId)) return;

        const docs = await TicketSetup.findOne({ GuildID: guild.id });

        if (!docs) return;
        if (!member.roles.cache.has(docs.Handlers)) return interaction.reply({ content: 'Yetkiniz Yok!', ephemeral: true });

        const embed = new EmbedBuilder().setColor('Aqua');
        const data = await TicketSchema.findOne({ ChannelID: channel.id });

        if (!data) return;

        switch (customId) {
            case 'kapat':
                if (data.Closed) return interaction.reply({ content: "Ticket zaten kapalı.", ephemeral: true });

                const transcript = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    filename: `${member.user.username}-ticket${data.Type}-${data.TicketID}.html`
                });

                await TicketSchema.updateOne({ ChannelID: channel.id }, { Closed: true });

                const transcriptEmbed = new EmbedBuilder()
                    .setTitle(`Transcript Type: ${data.Type}\nID: ${data.TicketID}`)
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                const transcriptProcessEmbed = new EmbedBuilder()
                    .setTitle("Transcript Kaydediliyor...")
                    .setDescription("Ticket, 10 saniye içinde kapatılacak. Ticket transcriptini almak için lütfen DM'lerinizi aktif edin.")
                    .setColor('Red')
                    .setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp();

                const res = await guild.channels.cache.get(docs.Transcripts).send({
                    embeds: [transcriptEmbed],
                    files: [transcript]
                });
                channel.send({ embeds: [transcriptProcessEmbed] });

                setTimeout(() => {
                    member.send({
                        embeds: [transcriptEmbed.setDescription(`Ticket transcriptiniz: ${res.url}`)]
                    }).catch(() => channel.send('Maalesef DM yoluyla ticket transcripti gönderilemedi.'));
                    channel.delete();
                }, 10000);

                break;

            case 'kilitle':
                if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: 'Yetkiniz Yok!', ephemeral: true });

                if (data.Locked) return interaction.reply({ content: "Ticket zaten kilitli.", ephemeral: true });

                await TicketSchema.updateOne({ ChannelID: channel.id }, { Locked: true });
                embed.setDescription('Ticket başarıyla kilitlendi 🔒');

                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, { SendMessages: false });
                });

                return interaction.reply({ embeds: [embed] });

            case 'aç':
                if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: 'Yetkiniz Yok!', ephemeral: true });

                if (!data.Locked) return interaction.reply({ content: "Ticket zaten kilitli değil.", ephemeral: true });

                await TicketSchema.updateOne({ ChannelID: channel.id }, { Locked: false });
                embed.setDescription('Ticket kilidi başarıyla kaldırıldı 🔓');

                data.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, { SendMessages: true });
                });

                return interaction.reply({ embeds: [embed] });

            case 'talep':
                if (!member.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.reply({ content: 'Yetkiniz Yok!', ephemeral: true });

                if (data.Claimed) return interaction.reply({ content: `Ticket <@${data.ClaimedBy}> tarafından talep edildi.`, ephemeral: true });

                await TicketSchema.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id });
                embed.setDescription(`Ticket başarıyla ${member} tarafından talep edildi.`);

                return interaction.reply({ embeds: [embed] });
        }
    }
}
