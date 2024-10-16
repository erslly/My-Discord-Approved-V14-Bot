const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Kullanıcıya Zaman Aşımı Atar")
        .addUserOption(option =>
            option.setName("hedef")
                .setDescription("Zaman Aşımı Uygulanacak Üyeyi Seçiniz")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("süre")
                .setDescription("Zaman Aşımının Süresini Giriniz.")
                .setRequired(true)
                .addChoices(
                    { name: '60 Seconds', value: '60' },
                    { name: '2 Minutes', value: '120' },
                    { name: '5 Minutes', value: '300' },
                    { name: '10 Minutes', value: '600' },
                    { name: '15 Minutes', value: '900' },
                    { name: '20 Minutes', value: '1200' },
                    { name: '30 Minutes', value: '1800' },
                    { name: '45 Minutes', value: '2700' },
                    { name: '1 Hour', value: '3600' }
                )
        )
        .addStringOption(option =>
            option.setName("neden")
                .setDescription("Zaman Aşımının Sebebini Giriniz")
                .setRequired(false)
        ),
    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const duration = options.getString('süre');
        const reason = options.getString('neden') || 'Neden Belirtilmedi';
        const timeMember = guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.reply({ content: 'Bu Komutu Kullanmaya Yetkiniz Yok!', ephemeral: true });
        if (!timeMember) return await interaction.reply({ content: 'Bu Kullanıcı Artık Bu Sunucuda Değil', ephemeral: true });
        if (!timeMember.kickable) return await interaction.reply({ content: 'Bu Üyeye Zaman Aşımı Uygulayamazsın!', ephemeral: true });
        if (interaction.member.id === timeMember.id) return await interaction.reply({ content: 'Kendini Susturamazsın!' });
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Zaman Aşımını **Yönetici** Yetkisi Olanlarda Uygulayamazsın!' });

        try {
            await timeMember.timeout(duration * 1000, reason);

            const embed = new EmbedBuilder()
                .setColor('Blue')
                .setTitle('Zaman Aşımı Uygulandı')
                .addFields(
                    { name: 'Üye', value: `> ${user.tag}`, inline: true },
                    { name: 'Zaman', value: `> ${duration / 60} dakika`, inline: true },
                    { name: 'Sebep', value: `> ${reason}`, inline: true }
                )
                .setTimestamp();

            const dmEmbed = new EmbedBuilder()
                .setColor('Blue')
                .setDescription(`<a:ok:1268237436937437255> ${guild.name} Sunucusunda Sana Zaman Aşımı Uygulandı! Durumu Görüntülemek İçin Sunucuya Bakabilirsin`);

            await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
                console.error(err);
            });

            await interaction.reply({ embeds: [embed] });
        } catch (e) {
            console.error(e);

            await interaction.reply({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', ephemeral: true });

           
        }
    }
};
