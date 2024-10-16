const { Client, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt-sistemi')
        .setDescription('Kayıt sistemini ayarlarsın!')
        .addChannelOption(option =>
            option.setName('kayıt-kanalı')
                .setDescription('Kayıt kanalını ayarlarsın!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('kayıt-yetkilisi')
                .setDescription('Kayıt yetkilisi rolünü ayarlarsın!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('kız-rol')
                .setDescription('Kız rolünü ayarlarsın!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('erkek-rol')
                .setDescription('Erkek rolünü ayarlarsın!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('kayıtsız-rol')
                .setDescription('Kayıtsız rolünü ayarlarsın!')
                .setRequired(true)),
    async execute(interaction) {
        const { guild, member } = interaction;
        const yetki = new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ | Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın!");

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki], ephemeral: true });

        const kayıtkanal = interaction.options.getChannel('kayıt-kanalı');
        const kayityetkilisi = interaction.options.getRole('kayıt-yetkilisi');
        const kızrol = interaction.options.getRole('kız-rol');
        const erkekrol = interaction.options.getRole('erkek-rol');
        const kayıtsızrol = interaction.options.getRole('kayıtsız-rol');

        const basarili = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`✅ | __**Kayıt Sistemi**__ başarıyla ayarlandı!\n\n ***#*** |  Kayıt Kanalı: ${kayıtkanal}\n🤖 Kayıt Yetkilisi Rolü: ${kayityetkilisi}\n🤖 Kız Rolü: ${kızrol}\n🤖 Erkek Rolü: ${erkekrol}\n🤖 Kayıtsız Rolü: ${kayıtsızrol}`);

        db.set(`kayıtsistemi_${guild.id}`, {
            kayıtkanal: kayıtkanal.id,
            kayityetkilisi: kayityetkilisi.id,
            kızrol: kızrol.id,
            erkekrol: erkekrol.id,
            kayıtsızrol: kayıtsızrol.id
        });

        return interaction.reply({ embeds: [basarili], ephemeral: false });
    },
};
