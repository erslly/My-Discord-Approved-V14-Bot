const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Belirttiğiniz kullanıcıya veya botun avatarını gösterir')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Avatarını göstermek istediğiniz kullanıcıyı seçin')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('avatartype')
            .setDescription('Profil avatarı / Sunucu avatarı')
            .setRequired(true)
            .addChoices(
                { name: 'Profil Avatarı', value: 'profile' },
                { name: 'Sunucu Avatarı', value: 'server' }
            )
        ),

    async execute(interaction) {
        const { options, guild } = interaction;

        const avatartype = options.getString('avatartype'); 
        const user = options.getUser('user');

        const member = guild.members.cache.get(user.id);

        let avatarURL;
        if (avatartype === 'server' && member.avatar) {
            avatarURL = member.displayAvatarURL({ dynamic: true, size: 1024 });
        } else {
            avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
        }

        if (!avatarURL) return interaction.reply(`${user.username} adlı kullanıcının avatarı bulunamadı.`);

        const sizes = [64, 128, 256, 512, 1024, 2048];
        const buttons = sizes.map(size => 
            new ButtonBuilder()
                .setLabel(`PNG x${size}`)
                .setStyle(ButtonStyle.Link)
                .setURL(user.displayAvatarURL({ extension: 'png', size }))
        );

        const rows = [];
        while (buttons.length) {
            rows.push(new ActionRowBuilder().addComponents(buttons.splice(0, 3)));
        }

        const avatarEmbed = new EmbedBuilder()
            .setTitle(`<a:helel:1268237436937437255> ${user.username} adlı üyenin avatarı`)
            .setColor('Random')
            .setImage(avatarURL)

        interaction.reply({ embeds: [avatarEmbed], components: rows });
    }
};
