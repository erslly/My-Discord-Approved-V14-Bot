const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kanal-oluştur')
        .setDescription('Yeni Kanal Oluşturur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption(option =>
            option.setName('channel-type')
                .setDescription('Kanalın Türünü Seçin.')
                .setRequired(true)
                .addChoices(
                    { name: 'Metin Kanalı', value: 'textchannel' },
                    { name: 'Ses Kanalı', value: 'voicechannel' }
                )
        )
        .addStringOption(option =>
            option.setName('channelname')
                .setDescription('Kanalın Adını Girin.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('parent-channel')
                .setDescription('Kanalın Nerde Oluşturulacağını Belirtin.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )
        .addRoleOption(option =>
            option.setName('permission-role')
                .setDescription('Kanala Erişim İçin Rol Seçin.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { guild, options } = interaction;

        const {
            ViewChannel,
            ReadMessageHistory,
            SendMessages
        } = PermissionFlagsBits;

        const channelType = options.getString('channel-type');
        const channelName = options.getString('channelname');
        const parent = options.getChannel('parent-channel');
        const permissionRole = options.getRole('permission-role');

        let permissionsOverwrite = [];

        permissionsOverwrite.push({
            id: guild.roles.everyone.id,
            allow: [ViewChannel, ReadMessageHistory, SendMessages]
        });

        if (permissionRole) {
            permissionsOverwrite.push({
                id: permissionRole.id,
                allow: [ViewChannel, SendMessages, ReadMessageHistory]
            });
        }

        try {
            let channel;

            if (channelType === 'textchannel') {
                channel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: parent,
                    permissionOverwrites: permissionsOverwrite
                });
            } else if (channelType === 'voicechannel') {
                channel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildVoice,
                    parent: parent,
                    permissionOverwrites: permissionsOverwrite
                });
            }

            await interaction.reply({ content: `<a:evet:1268233923721433231> Kanal başarıyla oluşturuldu: ${channel.name}`, ephemeral: true });
        } catch (error) {
            console.error('<a:no:1268231541524402246>  Kanal oluşturulurken bir hata oluştu:', error);
            await interaction.reply({ content: '<a:no:1268231541524402246>  Kanal oluşturulurken bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }
    }
};
