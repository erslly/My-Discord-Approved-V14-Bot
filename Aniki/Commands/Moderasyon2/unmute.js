const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Kullanıcının Zaman Aşımını Kaldırır")
        .addUserOption(option =>
            option.setName("hedef")
                .setDescription("Zaman Aşımını Kaldırmak İstediğiniz Üyeyi Seçiniz")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("neden")
                .setDescription("Sebep")
                .setRequired(false)
        ),
    async execute(interaction) {
        const { options, guild } = interaction;
        const user = options.getUser('hedef');
        const reason = options.getString('neden') || 'Neden Belirtilmedi';
        const timeMember = guild.members.cache.get(user.id);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
            return await interaction.reply({ content: 'Bu Komutu Kullanmaya Yetkiniz Yok!', ephemeral: true });
        if (!timeMember) return await interaction.reply({ content: 'Bu Kullanıcı Artık Bu Sunucuda Değil', ephemeral: true });
        if (!timeMember.kickable) return await interaction.reply({ content: 'Bu Üyenin Zaman Aşımını Kaldıramazsın!', ephemeral: true });
        if (interaction.member.id === timeMember.id) return await interaction.reply({ content: 'Kendi Susturmanı Kaldıramazsın', ephemeral: true });
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'Zaman Aşımını **Yönetici** Yetkisi Olanlarda Uygulayamazsın!' });

        if (!timeMember.communicationDisabledUntilTimestamp) 
            return await interaction.reply({ content: `**${user.tag}** üyesinin zaten bir zaman aşımı yok`, ephemeral: true });

        await timeMember.timeout(null, reason);

        const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Zaman Aşımı Kaldırıldı')
            .addFields({ name: 'Üye', value: `> ${user.tag}`, inline: true })
            .addFields({ name: 'Sebep', value: `> ${reason}`, inline: true })
            .setTimestamp();

        const dmEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setDescription(`<a:ok:1268237436937437255>  ${guild.name} Sunucusundaki Zaman Aşımın Kaldırıldı! Durumu Görüntülemek İçin Sunucuya Bakabilirsin`);

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            console.error(err);
        });

        await interaction.reply({ embeds: [embed] });
    }
}
