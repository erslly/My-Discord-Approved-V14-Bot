const { Client, EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, SlashCommandBuilder} = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt')
        .setDescription('Bir kullanıcıyı kayıt eder.')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Kayıt edilecek kullanıcı.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('isim')
                .setDescription('Kullanıcının ismi.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('yaş')
                .setDescription('Kullanıcının yaşı.')
                .setRequired(true)),
    async execute(interaction) {
        const { user, guild } = interaction;
        const kayıtKullanıcı = interaction.options.getUser('kullanıcı');
        const isim = interaction.options.getString('isim');
        const yaş = interaction.options.getString('yaş');

        const kayitSistemi = db.fetch(`kayıtsistemi_${guild.id}`);
        if (!kayitSistemi) return interaction.reply({ content: 'Kayıt sistemi ayarlanmamış!', ephemeral: true });

        if (!interaction.member.roles.cache.has(kayitSistemi.kayityetkilisi)) {
            return interaction.reply({ content: 'Bu komutu kullanmak için yetkili rolüne sahip olmalısın!', ephemeral: true });
        }

        const member = guild.members.cache.get(kayıtKullanıcı.id);
        if (!member) return interaction.reply({ content: 'Kullanıcı bulunamadı!', ephemeral: true });

        const rol = yaş >= 18 ? kayitSistemi.erkekrol : kayitSistemi.kızrol;
        const kayıtsız = kayitSistemi.kayıtsızrol;

        await member.setNickname(`${isim} | ${yaş}`).catch(console.error);
        await member.roles.remove(kayıtsız).catch(console.error);
        await member.roles.add(rol).catch(console.error);

        db.set(`uye_${member.id}`, { isim, yaş });

        return interaction.reply({ content: `${member} başarıyla kayıt edildi!`, ephemeral: true });
    },
};
