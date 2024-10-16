const { Client, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('çekiliş')
        .setDescription('Bir çekiliş başlatır.')
        .addStringOption(option =>
            option.setName('ödül')
                .setDescription('Çekilişin ödülü nedir?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('süre')
                .setDescription('Çekilişin süresi (örneğin: 1m, 1h, 1d)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('kazanan-sayısı')
                .setDescription('Çekilişi kazanacak kişi sayısı')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Çekiliş başlatma yetkiniz yok!", ephemeral: true });
        }

        const ödül = interaction.options.getString('ödül');
        const süre = interaction.options.getString('süre');
        const kazananSayısı = interaction.options.getInteger('kazanan-sayısı');

        if (kazananSayısı === null || kazananSayısı <= 0) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Geçersiz kazanan sayısı! Lütfen geçerli bir sayı girin.", ephemeral: true });
        }

        const süreMs = ms(süre);
        if (!süreMs) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Geçersiz süre formatı! Lütfen doğru bir süre girin (örneğin: 1m, 1h, 1d).", ephemeral: true });
        }

        const bitişZamanı = Date.now() + süreMs;
        const serverIcon = interaction.guild.iconURL();

        const embed = new EmbedBuilder()
            .setTitle("🎉 Çekiliş Başladı! ")
            .setDescription(`Ödül: **${ödül}**\nSüre: **<t:${Math.floor(bitişZamanı / 1000)}:R>**\nKazanan sayısı: **${kazananSayısı}**\nKatılımcı sayısı: **0**\nKatılmak için aşağıdaki 🎉 butonuna tıklayın!`)
            .setColor("#00FF00")
            .setImage("https://media1.tenor.com/m/7LccfI4pr9gAAAAC/anime-kawaii.gif")
            .setTimestamp()
            .setThumbnail(serverIcon);

        const katilButton = new ButtonBuilder()
            .setCustomId('katil')
            .setLabel('Katıl 🎉')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(katilButton);

        const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

        db.set(`çekiliş_${msg.id}`, {
            ödül,
            kazananSayısı,
            katılımcılar: [],
            bitiş: bitişZamanı,
            kanal: msg.channel.id,
            mesaj: msg.id,
            bitirildi: false
        });

        const filter = i => i.customId === 'katil' && i.message.id === msg.id;
        const collector = msg.createMessageComponentCollector({ filter, time: süreMs });

        collector.on('collect', async i => {
            const çekilişData = db.get(`çekiliş_${msg.id}`);
            if (i.customId === 'katil') {
                if (!çekilişData.katılımcılar.includes(i.user.id)) {
                    çekilişData.katılımcılar.push(i.user.id);
                    db.set(`çekiliş_${msg.id}`, çekilişData);
                    await i.reply({ content: "Çekilişe katıldınız! 🎉", ephemeral: true });
                } else {
                    çekilişData.katılımcılar = çekilişData.katılımcılar.filter(id => id !== i.user.id);
                    db.set(`çekiliş_${msg.id}`, çekilişData);
                    await i.reply({ content: "Çekilişten ayrıldınız! 🎉", ephemeral: true });
                }

                // Katılımcı sayısını güncelle
                const katılımcıSayısı = çekilişData.katılımcılar.length;
                const updatedEmbed = new EmbedBuilder()
                    .setTitle("🎉 Çekiliş Başladı! ")
                    .setDescription(`Ödül: **${ödül}**\nSüre: **<t:${Math.floor(bitişZamanı / 1000)}:R>**\nKazanan sayısı: **${kazananSayısı}**\nKatılımcı sayısı: **${katılımcıSayısı}**\nKatılmak için aşağıdaki 🎉 butonuna tıklayın!`)
                    .setColor("#00FF00")
                    .setImage("https://media1.tenor.com/m/7LccfI4pr9gAAAAC/anime-kawaii.gif")
                    .setTimestamp()
                    .setThumbnail(serverIcon);

                await i.message.edit({ embeds: [updatedEmbed] });
            }
        });

        collector.on('end', async () => {
            const çekilişData = db.get(`çekiliş_${msg.id}`);
            if (çekilişData && !çekilişData.bitirildi) {
                çekilişData.bitirildi = true;
                db.set(`çekiliş_${msg.id}`, çekilişData);
                await cekilisYap(msg.id, çekilişData.kazananSayısı, çekilişData.ödül, interaction, serverIcon);
            }
        });

        // Çekilişi süresi dolunca otomatik bitir
        setTimeout(async () => {
            const çekilişData = db.get(`çekiliş_${msg.id}`);
            if (çekilişData && !çekilişData.bitirildi) {
                çekilişData.bitirildi = true;
                db.set(`çekiliş_${msg.id}`, çekilişData);
                await cekilisYap(msg.id, çekilişData.kazananSayısı, çekilişData.ödül, interaction, serverIcon);
            }
        }, süreMs);
    }
};

async function cekilisYap(mesajId, kazananSayısı, ödül, interaction, serverIcon) {
    const çekilişData = db.get(`çekiliş_${mesajId}`);
    if (çekilişData && çekilişData.bitirildi) {
        if (çekilişData.katılımcılar.length === 0) {
            return interaction.followUp({ content: "<a:no:1268231541524402246> | Yeterli katılımcı yok, çekiliş iptal edildi." });
        }

        const kazananlar = çekilişData.katılımcılar.sort(() => Math.random() - Math.random()).slice(0, kazananSayısı);
        const kazananListesi = kazananlar.map(id => `<@${id}>`).join(', ');

        const winnerEmbed = new EmbedBuilder()
            .setTitle("🎉 Çekiliş Sona Erdi! ")
            .setDescription(`Ödül: **${ödül}**\nKazananlar: ${kazananListesi}\nTebrikler!`)
            .setColor("#FF0000")
            .setImage("https://media1.tenor.com/m/CDLTMWbZUzkAAAAC/anime-surprised.gif")
            .setTimestamp()
            .setThumbnail(serverIcon);

        await interaction.followUp({ embeds: [winnerEmbed] });

        for (const id of kazananlar) {
            try {
                const user = await interaction.guild.members.fetch(id);
                if (user && user.user) {
                    const dmEmbed = new EmbedBuilder()
                        .setTitle("🎉 Kazandınız! 🎉")
                        .setDescription(`Tebrikler! Kazandığınız ödül: **${ödül}**`)
                        .setColor("#FFD700")
                        .setTimestamp()
                        .setThumbnail(serverIcon);
            
                    await user.send({ embeds: [dmEmbed] });
                } else {
                    console.error(`Kullanıcı bulunamadı veya null: ${id}`);
                }
            } catch (err) {
                console.error('Kazanana özel mesaj gönderilemedi:', err);
            }
        }

        // Mod log kısmını kaldırdık
    }
}
