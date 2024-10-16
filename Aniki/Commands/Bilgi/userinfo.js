const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kullanıcı")
        .setDescription('Bir Üyenin Bilgilerini Görmeni Sağlar')
        .addUserOption(option =>
            option.setName("hedef")
                .setDescription('Bilgilerini Görmek İstediğin Kullanıcıyı Seç')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const { options, guild } = interaction;
            const user = options.getUser('hedef') || interaction.user;
            const member = await guild.members.fetch(user.id);
            const icon = user.displayAvatarURL();
            const tag = user.tag;

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setAuthor({ name: tag, iconURL: icon })
                .addFields(
                    { name: 'Kullanıcı İsmi', value: `${user}`, inline: false },
                    { name: 'Roller', value: `${member.roles.cache.map(r => r).join(" ")}`, inline: false },
                    { name: 'Sunucuya Katıldığı Tarih', value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: true },
                    { name: 'Discorda Katıldığı Tarih', value: `<t:${parseInt(user.createdAt / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: `Kullanıcı ID: ${user.id}` })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(`Kullanıcı bilgisi alınırken bir hata oluştu: ${error}`);
            await interaction.reply({ content: 'Kullanıcı bilgisi alınırken bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }
    }
};
