const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Levels = require('discord.js-leveling');
const afkCommand = require('../../Commands/Genel/afk');
const db = require('croxydb');
const fs = require('fs');

module.exports = {
    name: "messageCreate",
    
    async execute(message) {
        // Sunucuda olmayan veya bot mesajlarını yok say
        if (!message.guild || message.author.bot) return;

        // Mesaj uzunluğunun 3 karakterden az olup olmadığını kontrol et
        if (message.content.length < 3) return;

        // Küfür engel sistemini kontrol et
        const kufurEngel = db.fetch(`kufurengel_${message.guild.id}`);
        if (kufurEngel) {
            const kufurler = ["sikik", "amınake", "aminake", "sike", "sikey", "sikeyi", "amk", "piç", "yarrak", "oç", "göt", "amq", "yavşak", "amcık", "amcı", "orospu", "sikim", "sikeyim", "aq", "mk", "oruspu çocugu", "çocugu", "ananı", "sıkım", "amcık", "yar", "oruspu", "baban jigolo", "aile boyu orospunuz", "ailen fahişlere klubü", "ailen oç", "ailen oropular konseyi", "ailen yarrağıma bağımlı", "ailen yavşak mı", "ailene boydan gireyim", "ailene gibtir git", "ailene götten gireyim", "ailene matkapla gireyim", "ailene tornavida ile gireyim", "aileni götten sikerim", "aileni ıslak sopayla sikeyim", "aileni kökten sikerim", "aileni kucakta aneni yatakta", "aileni sikeyim", "aileni siktim öldü", "aileni siqem", "aileni toplu sikeirm", "aileni yarrakla sikerim", "ailenin ağızına sıçayım", "ailenin amına koyayım", "ailenin amk", "ailenle toplu seks edem", "Allah oç", "Allah orospu", "Allah yavşak", "Allah yedim öldü", "Allahı sikeyim", "Allahı siktim öldü", "Allahın amk", "Allahını sikerim", "Allahını sikeyim", "Allah'ını sikeyim", "Allahini sikeyim", "Allah'ini sikeyim", "amınakoduğum ailesizi", "amk veledi ailene git", "anan aramış sikilmesi gerek", "anan bağımlım ama yarak", "anan bar fahişesi", "anan benim zuckeri istiyor", "anan bilir", "anan eskort", "anan esxort", "anan fahişe", "anan fuck", "anan fuck it", "anan fuck itlerim"];
            if (kufurler.some((word) => message.content.toLowerCase().includes(word))) {
                if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    message.delete();
                    const embed = new EmbedBuilder()
                        .setTitle(` **UYARI!**`)
                        .setDescription(`<a:ok:1268237436937437255> | ${message.author}, Küfür etmeye devam edersen moderatörler sana çok kızıcak!`);
                    const msg = await message.channel.send({ embeds: [embed] });
                    if (msg) setTimeout(() => msg.delete(), 5000);
                    return;
                }
            }
        }

        // Reklam engel sistemini kontrol et
        const bannedLinks = fs.readFileSync('domain-liste.txt', 'utf8').split('\n').map(word => word.trim());
        const reklamEngel = db.fetch(`reklamengel_${message.guild.id}`);
        if (reklamEngel) {
            if (!message.author.bot && message.channel.type !== "dm") {
                const content = message.content.toLowerCase();
                if (bannedLinks.some((bannedLink) => content.includes(bannedLink))) {
                    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                        message.delete();
                        const embed = new EmbedBuilder()
                            .setTitle(` **UYARI!**`)
                            .setDescription(`${message.author}, bu sunucuda reklam atamazsın!`);
                        const msg = await message.channel.send({ embeds: [embed] });
                        if (msg) setTimeout(() => msg.delete(), 5000);
                        return;
                    }
                }
            }
        }

        // Caps-Clock engel sistemini kontrol et
        const capsClockEngel = db.fetch(`capsclockengel_${message.guild.id}`);

        if (capsClockEngel) {
            // Mesaj botlardan gelmiyorsa ve DM değilse
            if (!message.author.bot && message.channel.type !== 'DM') {
                // Mesaj içindeki büyük harf oranını hesapla
                const content = message.content;
                const totalLetters = content.length;
                const uppercaseLetters = content.replace(/[^A-Z]/g, '').length;

                // Büyük harf oranını kontrol et (örneğin, %60)
                if (totalLetters > 0 && (uppercaseLetters / totalLetters) > 0.6) {
                    // Mesajı sil ve kullanıcıyı uyar
                    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        message.delete();

                        // Uyarı mesajını oluştur
                        const embed = new EmbedBuilder()
                            .setTitle('**UYARI!**')
                            .setDescription(`<a:ok:1268237436937437255> | ${message.author}, çok fazla büyük harf kullanıyorsun! Lütfen daha dikkatli ol.`)
                            .setColor('Red');

                        // Uyarı mesajını gönder ve sonra sil
                        const msg = await message.channel.send({ embeds: [embed] });
                        if (msg) setTimeout(() => msg.delete(), 5000);
                    }
                }
            }
        }


        // AFK kullanıcıları kontrol et
        const afkUsers = afkCommand.getAfkUsers();

        if (afkUsers.has(message.author.id)) {
            const reason = afkUsers.get(message.author.id);
            afkUsers.delete(message.author.id); // AFK durumunu kaldır

            const afkEndEmbed = new EmbedBuilder()
                .setColor('#00ff00')
                .setTitle('AFK Durumu')
                .setDescription(`${message.author.username} artık AFK değil.`)
                .setTimestamp();

            await message.channel.send({ embeds: [afkEndEmbed] });
        }

        // Rastgele XP miktarını belirle
        const randomAmountOfExp = Math.floor(Math.random() * 24) + 1;

        try {
            // XP ekle ve seviye atlayıp atlamadığını kontrol et
            const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfExp);

            if (hasLeveledUp) {
                const user = await Levels.fetch(message.author.id, message.guild.id);

                const levelEmbed = new EmbedBuilder()
                    .setTitle("Yeni Seviyeniz!")
                    .setDescription(`**Tebrikler!** ${message.author}, **${user.level}** seviyesine ulaştın!`)
                    .setColor('#' + Math.floor(Math.random() * 16777215).toString(16))
                    .setTimestamp();

                const sendEmbed = await message.channel.send({ embeds: [levelEmbed] });
                sendEmbed.react('🍀');
            }
        } catch (error) {
            console.error('XP eklerken bir hata oluştu:', error);
        }
    }
};