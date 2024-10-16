const { Client, EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("çekiliş-reroll")
        .setDescription("Bir çekilişi yeniden çeker.")
        .addStringOption(option =>
            option.setName("mesaj_id")
                .setDescription("Yeniden çekmek istediğiniz çekilişin mesaj ID'si")
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Çekilişi yeniden çekme yetkiniz yok!", ephemeral: true });
        }

        const mesajId = interaction.options.getString('mesaj_id');
        const çekilişData = db.get(`çekiliş_${mesajId}`);

        if (!çekilişData) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Belirtilen mesaj ID'sine ait bir çekiliş bulunamadı!", ephemeral: true });
        }

        const katilimcilar = new Set(çekilişData.katılımcılar);
        if (katilimcilar.size === 0) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Çekilişte yeterli katılımcı yok, yeniden çekim yapılamaz.", ephemeral: true });
        }

        const kazananSayısı = çekilişData.kazananSayısı;
        const ödül = çekilişData.ödül;
        const serverIcon = interaction.guild.iconURL();

        const kazananlar = Array.from(katilimcilar).sort(() => Math.random() - Math.random()).slice(0, kazananSayısı);
        const kazananListesi = kazananlar.map(id => `<@${id}>`).join(', ');

        const rerollEmbed = new EmbedBuilder()
            .setTitle("🎉 Çekiliş Yeniden Çekildi! ")
            .setDescription(`Ödül: **${ödül}**\nYeni Kazananlar: ${kazananListesi}\nTebrikler!`)
            .setColor("Random")
            .setTimestamp()
            .setThumbnail(serverIcon);

        await interaction.reply({ embeds: [rerollEmbed] });

        kazananlar.forEach(async id => {
            try {
                const user = await interaction.guild.members.fetch(id);
                const dmEmbed = new EmbedBuilder()
                    .setTitle("🎉 Tebrikler! ")
                    .setDescription(`Kazandığınız ödül: **${ödül}**\nSunucu: **${interaction.guild.name}**`)
                    .setColor("Random")
                    .setTimestamp()
                    .setThumbnail(serverIcon);

                await user.send({ embeds: [dmEmbed] });
            } catch (err) {
                console.error('Kazanana özel mesaj gönderilemedi:', err);
            }
        });
    }
};
