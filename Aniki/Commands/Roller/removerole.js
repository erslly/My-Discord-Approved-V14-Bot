const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-role')
        .setDescription('Üyeyi Bir Rolden Çıkar')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Rolden Çıkarılacak Üyeyi Seçin.')
            .setRequired(true)
        )
        .addRoleOption(option => 
            option.setName('role')
            .setDescription('Rolden Çıkarılacak Üyeyi Seçin.')
            .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild } = interaction;
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
        const member = await guild.members.fetch(user.id);

        if(!member.roles.cache.has(role.id)) {
            const embed = new EmbedBuilder()
                .setColor('Yellow')
                .setDescription(`${user} Zaten \`${role.name}\` Rolüne Sahip Değil`)
                .setAuthor({
                    name: interaction.user.username,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        try {
            await interaction.guild.members.cache.get(user.id).roles.remove(role);
            const embed = new EmbedBuilder()
                .setColor(role.color)
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`<a:evet:1268233923721433231> ${user} Başarılı Bir Şekilde \`${role.name}\` Rolünden Çıkarıldı`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            console.error(err);
            const embed = new EmbedBuilder()
                .setColor('NotQuiteBlack')
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`Üye ${user.tag}, \`${role.name}\` Rolünden Çıkarılırken Bir Hata Oluştu.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
};
