const { SlashCommandBuilder, EmbedBuilder, ChannelType, GuildVerificationLevel } = require("discord.js");
const moment = require("moment");
const { uptime } = require('../../Functions/uptime');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucu hakkında detaylı bilgi verir.'),

  async execute(interaction) {
    const guild = interaction.guild;
    const client = interaction.client; // client nesnesini interaction'dan alıyoruz
    await guild.members.fetch();

    try {
      const { name, id, preferredLocale, channels, roles, ownerId } = guild;

      const owner = await guild.members.fetch(ownerId);
      const createdAt = moment(guild.createdAt);

      const totalChannels = channels.cache.size;
      const categories = channels.cache.filter((c) => c.type === ChannelType.GuildCategory).size;
      const textChannels = channels.cache.filter((c) => c.type === ChannelType.GuildText).size;
      const voiceChannels = channels.cache.filter(
        (c) => c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice
      ).size;
      const threadChannels = channels.cache.filter(
        (c) => c.type === ChannelType.PrivateThread || c.type === ChannelType.PublicThread
      ).size;

      const memberCache = guild.members.cache;
      const all = memberCache.size;
      const bots = memberCache.filter((m) => m.user.bot).size;
      const users = all - bots;
      const onlineUsers = memberCache.filter((m) => !m.user.bot && m.presence?.status === "online").size;
      const onlineBots = memberCache.filter((m) => m.user.bot && m.presence?.status === "online").size;
      const onlineAll = onlineUsers + onlineBots;

      let verificationLevel = guild.verificationLevel;
      switch (verificationLevel) {
        case GuildVerificationLevel.VeryHigh:
          verificationLevel = "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻";
          break;

        case GuildVerificationLevel.High:
          verificationLevel = "(╯°□°）╯︵ ┻━┻";
          break;

        default:
          verificationLevel = "Bilinmiyor";
          break;
      }

      const desc = [
        `**Id:** ${id}`,
        `**Ad:** ${name}`,
        `**Sahip:** ${owner.user.username}`,
        `**Bölge:** ${preferredLocale}`,
        `**Sunucu Oluşturulma Tarihi:** ${createdAt.format("dddd, Do MMMM YYYY")}`
      ].join("\n");

      const embed = new EmbedBuilder()
        .setTitle("SUNUCU BİLGİLERİ")
        .setThumbnail(guild.iconURL())
        .setColor("#7289DA")
        .setDescription(desc)
        .addFields(
          {
            name: `Sunucu Üyeleri [${all}]`,
            value: `\`\`\`Üyeler: ${users}\nBotlar: ${bots}\`\`\``,
            inline: true,
          },
          {
            name: `Çevrimiçi İstatistikler [${onlineAll}]`,
            value: `\`\`\`Üyeler: ${onlineUsers}\nBotlar: ${onlineBots}\`\`\``,
            inline: true,
          },
          {
            name: `Kategoriler ve Kanallar [${totalChannels}]`,
            value: `\`\`\`Kategoriler: ${categories} | Metin: ${textChannels} | Ses: ${voiceChannels} | Konu: ${threadChannels}\`\`\``,
            inline: false,
          },
          {
            name: "Doğrulama Seviyesi",
            value: `\`\`\`${verificationLevel}\`\`\``,
            inline: true,
          },
          {
            name: "Boost Sayısı",
            value: `\`\`\`${guild.premiumSubscriptionCount}\`\`\``,
            inline: true,
          },
          {
            name: "Bot Uptime Süresi",
            value: `\`\`\`${uptime(client.uptime)}\`\`\``,
            inline: false,
          },
          {
            name: `Sunucu Oluşturulma [${createdAt.fromNow()}]`,
            value: `\`\`\`${createdAt.format("dddd, Do MMMM YYYY")}\`\`\``,
            inline: false,
          }
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Bir hata oluştu:", error);
      await interaction.reply({ content: 'Bilgileri çekerken bir hata oluştu.', ephemeral: true });
    }
  },
};
