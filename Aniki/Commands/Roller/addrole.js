const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-role')
        .setDescription('Üyeye bir rol atar.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles) // Yetkiler: Yönetici Rolleri
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Rol atayacağınız üyeyi seçin.')
                .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Atanacak rolü seçin.')
                .setRequired(true)
        ),

    async execute(interaction, client) {
        const { guild } = interaction;
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        try {
            const member = await guild.members.fetch(user.id); // Üye bilgilerini al

            if (member.roles.cache.has(role.id)) {
                const embed = new EmbedBuilder()
                    .setColor('Yellow')
                    .setDescription(`${user} zaten \`${role.name}\` rolüne sahip.`)
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            // Botun rolü, atanacak rolü yönetebiliyor mu kontrolü
            const botMember = await guild.members.fetch(client.user.id);
            if (botMember.roles.highest.position <= role.position) {
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('Botun rolü, bu rolü yönetmek için yeterli yetkiye sahip değil.')
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            await member.roles.add(role.id);
            const embed = new EmbedBuilder()
                .setColor(role.color || 'Green')
                .setAuthor({
                    name: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(`<a:evet:1268233923721433231> ${user} başarılı bir şekilde \`${role.name}\` rolüne atandı.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            if (err.code === 10007) {
                // Bilgi bulamadığında verilecek yanıt
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setDescription('Belirtilen üye sunucuda bulunmuyor veya botun bilgilerini güncelleyemiyor.')
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                // Diğer hataları işle
                console.error(err);
                const embed = new EmbedBuilder()
                    .setColor('Red')
                    .setAuthor({
                        name: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setDescription(`Üye ${user.tag}, \`${role.name}\` rolüne atanırken bir hata oluştu.`)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    }
};
