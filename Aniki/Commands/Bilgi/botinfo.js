const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cpustat = require('cpu-stat');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-bilgi')
        .setDescription('Bot hakkında bilgi verir.'),

    async execute(interaction, client) {
        const days = Math.floor(client.uptime / 86400000);
        const hours = Math.floor(client.uptime / 3600000) % 24;
        const minutes = Math.floor(client.uptime / 60000) % 60;
        const seconds = Math.floor(client.uptime / 1000) % 60;

        try {
            const cpuPercent = await getCpuUsage();
            const memoryUsage = formatBytes(process.memoryUsage().heapUsed);
            const node = process.version;
            const cpu = cpuPercent ? cpuPercent.toFixed(2) : "N/A";
            const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
            const totalGuilds = client.guilds.cache.size;
            const avatarURL = client.user.displayAvatarURL();

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('Bot Bilgileri')
                .setThumbnail(avatarURL)
                .addFields(
                    { name: "Geliştirici", value: "<@815668704435896321>\n<@715945443812573255>", inline: true },
                    { name: "Kullanıcı Adı", value: `${client.user.username}`, inline: true },
                    { name: "ID", value: `${client.user.id}`, inline: true },
                    { name: "Kurulma Tarihi", value: "17.05.2024", inline: true },
                    { name: "Yardım Komutu", value: "/help", inline: true },
                    { name: "Çalışma Süresi", value: `\`${days}\` gün, \`${hours}\` saat, \`${minutes}\` dakika ve \`${seconds}\` saniye`, inline: true },
                    { name: "Bot-Ping (ms)", value: `${client.ws.ping}ms`, inline: true },
                    { name: "Node Versiyonu", value: `${node}`, inline: true },
                    { name: "CPU Kullanımı", value: `%${cpu}`, inline: true },
                    { name: "Bellek Kullanımı", value: `${memoryUsage}`, inline: true },
                    { name: "Toplam Kullanıcı Sayısı", value: `${totalUsers}`, inline: true },
                    { name: "Toplam Sunucu Sayısı", value: `${totalGuilds}`, inline: true }
                )
                .setTimestamp();

            const supportButton = new ButtonBuilder()
                .setLabel('Destek Sunucusu')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/ryf4qrJWCC'); // Destek sunucunuzun linkini buraya ekleyin

            const row = new ActionRowBuilder().addComponents(supportButton);

            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error(`Failed to retrieve CPU usage: ${error}`);
            await interaction.reply({ content: 'Bilgi alınırken bir hata oluştu, lütfen daha sonra tekrar deneyin.', ephemeral: true });
        }

        function formatBytes(a, b) {
            let c = 1024,
                d = b || 2,
                e = ['B', 'KB', 'MB', 'GB', 'TB'],
                f = Math.floor(Math.log(a) / Math.log(c));

            return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
        }

        function getCpuUsage() {
            return new Promise((resolve, reject) => {
                cpustat.usagePercent((error, percent) => {
                    if (error) {
                        resolve(null);
                    } else {
                        resolve(percent);
                    }
                });
            });
        }
    }
};
