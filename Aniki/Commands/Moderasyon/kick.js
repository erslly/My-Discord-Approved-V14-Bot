const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Embed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Bir üyeyi sunucudan atmak için kullanılır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('hedef')
                .setDescription('Banlanacak Üyeyi Seçin')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('neden')
                .setDescription('Atılma Nedeni')
                .setRequired(false)
        ),
    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const reason = options.getString('neden') || 'Neden Belirtilmedi';

        try {
            const member = await guild.members.fetch(user.id);
            await member.kick({ reason });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .addFields(
                    { name: 'Atılan Kişi', value: `${user}` },
                    { name: 'Neden', value: `${reason}` }
                );

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);

            const errEmbed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`<a:no:1268231541524402246> ${user.username} Kullanıcısını Atamazsın!`);

            await interaction.reply({ embeds: [errEmbed] });

            
        }
    }
};
