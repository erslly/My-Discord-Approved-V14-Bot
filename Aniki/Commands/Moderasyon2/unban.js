const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Bir üyeynin banını kaldır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('Banını Kaldırmak İstediğin Üyenin ID bilgilerini Gir.')
                .setRequired(true)
        ),
    async execute(interaction) 
    {
        const { options, guild } = interaction;
        const userId = options.getString('userid');

        try {
            
            await guild.members.unban(userId)

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${userId} Kullanıcısının Banı Kaldırıldı`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);
            const errEmbed = new EmbedBuilder()
            .setColor('Red')
            .setDescription(`Geçerli Bir ID giriniz.`)

            await interaction.reply({embeds: [errEmbed], ephemeral: true});
        }
    }
};
