const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Belirttiğin üyeyi sunucudan yasaklar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('hedef')
                .setDescription('Banlanacak üyeyi seçin.')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('neden')
                .setDescription('Banlanma nedeni.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const reason = options.getString('neden') || 'Neden belirtilmedi';

        const member = await guild.members.fetch(user.id);

        try {
            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:evet:1268233923721433231> ${user} adlı üyeyi sunucudan yasakladım. \n\n **Banlanma nedeni:** ${reason}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.log(e);

            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:no:1268231541524402246> ${user.username} **Kullanıcısını Banlayamazsınız.**`);

            await interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
};
