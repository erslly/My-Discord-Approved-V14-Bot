const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rol-bilgi')
        .setDescription('Belirtilen rol hakkında bilgi verir.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Bilgilerini Görmek İstediğiniz Rolü Seçin.')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const { options, guild } = interaction;
            const role = options.getRole('role');

            const name = role.name || 'Bilgi Yok';
            const id = role.id || 'Bilgi Yok';
            const color = role.hexColor || '#000000';
            const icon = role.iconURL() || 'https://via.placeholder.com/150';
            const pos = role.rawPosition || 'Bilgi Yok';
            const mentionable = role.mentionable ? 'Evet' : 'Hayır';

            const members = await guild.members.fetch();
            const membersWithRole = members.filter(member => member.roles.cache.has(role.id));
            const count = membersWithRole.size || 'Bilgi Yok';

            const embed = new EmbedBuilder()
                .setColor(color)
                .setThumbnail(icon)
                .addFields(
                    { name: 'Rolün Adı', value: name },
                    { name: 'Rol ID', value: id },
                    { name: 'Renk', value: color },
                    { name: 'Etiketlenebilme', value: mentionable },
                    { name: 'Rol Pozisyonu', value: pos.toString() },
                    { name: 'Role Sahip Üye Sayısı', value: count.toString() }
                )
                .setFooter({ text: 'Rol Bilgisi' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(`Rol bilgisi alınırken bir hata oluştu: ${error}`);
            await interaction.reply({ content: 'Rol bilgisi alınırken bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }
    }
};
