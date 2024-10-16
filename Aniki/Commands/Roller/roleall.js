const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-all')
        .setDescription('Bir Rolü Herkese Ata')
        .addRoleOption(option => option.setName('role').setDescription('Atacağınız Rol').setRequired(true)),

    async execute(interaction) {
        const { options, guild } = interaction;
        const role = options.getRole('role');


        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: 'Yetkiniz yok.', ephemeral: true });
        }

        await interaction.reply({ content: `💥 Herkese ${role.name} rolü atanıyor`, ephemeral: true });

        const members = await guild.members.fetch();
        let num = 0;


        for (const [_, member] of members) {
            try {
                if (!member.roles.cache.has(role.id)) { 
                    await member.roles.add(role);
                    num++;
                }
            } catch (error) {
                console.error(`Rol atama hatası (${member.user.tag}):`, error);
            }


            if (num % 10 === 0 || num === members.size) {
                const embed = new EmbedBuilder()
                    .setColor(role.color)
                    .setDescription(`<a:evet:1268233923721433231> ${num} üye artık ${role.name} rolüne sahip!`);

                await interaction.editReply({ embeds: [embed] });
            }
        }

  
        const finalEmbed = new EmbedBuilder()
            .setColor(role.color)
            .setDescription(`<a:evet:1268233923721433231> Toplam ${num} üye ${role.name} rolünü aldı!`);

        await interaction.editReply({ embeds: [finalEmbed] });
    }
};
