const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yavaş-mod')
        .setDescription('Üyelerin Kaç Saniyede Bir Mesaj Yazacağını Ayarlar')
        .addIntegerOption(option =>
            option.setName("duration")
                .setDescription("Kaç Saniyede Mesaj Göndereceğinizi Belirleyin")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Hangi Kanala Uygulamak İstersin?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(false)
        ),
    
    async execute(interaction) {
        const { options } = interaction;
        const duration = options.getInteger('duration');
        const channel = options.getChannel('channel') || interaction.channel;

        try {
            await channel.setRateLimitPerUser(duration);
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: 'Bir hata oluştu, lütfen tekrar deneyin.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('Orange')
            .setDescription(`<a:evet:1268233923721433231> ${channel} kanalına ${duration} saniyelik **Yavaş Mod** Uygulanmıştır`);

        await interaction.reply({ embeds: [embed] });
    }
}
