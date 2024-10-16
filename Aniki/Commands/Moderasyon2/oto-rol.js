const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('croxydb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oto-rol')
        .setDescription('Yeni Gelenlere Otomatik Rol Verir!')
        .addRoleOption(option =>
            option.setName('rol')
                .setDescription('Lütfen bir rol etiketle!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('bot-rol')
                .setDescription('Lütfen bir rol etiketle!')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: '<a:no:1268231541524402246> | Rolleri Yönet Yetkin Yok!', ephemeral: true });
        }

        const rol = interaction.options.getRole('rol');
        const bot = interaction.options.getRole('bot-rol');

        try {
            db.set(`botrol_${interaction.guild.id}`, bot.id);
            console.log(`Bot rolü ${bot.id} olarak kaydedildi.`);
        } catch (error) {
            console.error(`Bot rolü veritabanına kaydedilirken bir hata oluştu: ${error}`);
            await interaction.followUp({ content: '<a:no:1268231541524402246> | Bot rolü veritabanına kaydedilirken bir hata oluştu.', ephemeral: true });
        }

        try {
            db.set(`otorol_${interaction.guild.id}`, rol.id);
            console.log(`Oto-rol ${rol.id} olarak kaydedildi.`);
        } catch (error) {
            console.error(`Oto-rol veritabanına kaydedilirken bir hata oluştu: ${error}`);
            await interaction.followUp({ content: '<a:no:1268231541524402246> | Oto-rol veritabanına kaydedilirken bir hata oluştu.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`<a:evet:1268233923721433231> | Oto-rol başarıyla ${rol} olarak ayarlandı, Bot rolü ise ${bot} olarak ayarlandı!`);

        try {
            await interaction.reply({ embeds: [embed] });
            console.log('Yanıt başarıyla gönderildi.');
        } catch (error) {
            console.error(`Yanıt gönderilirken bir hata oluştu: ${error}`);
        }
    },
};
