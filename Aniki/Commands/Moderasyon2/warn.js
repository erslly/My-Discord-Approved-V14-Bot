const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('croxydb');
const ms = require('ms');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Bir kullanıcıya uyarı verir.')
    .addUserOption(option =>
      option.setName('kullanıcı')
        .setDescription('Uyarı verilecek kullanıcıyı seçin')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Uyarı sebebini belirtin')
        .setRequired(true)),

  async execute(interaction) {
    const modRoleID = db.get(`Mod_${interaction.guild.id}`);
    const modRole = interaction.guild.roles.cache.get(modRoleID);

    if (!modRole) {
      return interaction.reply({ content: "Mod rolü ayarlanmamış. Lütfen önce mod rolünü ayarlayın.", ephemeral: true });
    }

    if (!interaction.member.roles.cache.has(modRole.id)) {
      return interaction.reply({ content: "Bu komutu kullanmak için yetkiniz yok.", ephemeral: true });
    }

    const user = interaction.options.getMember('kullanıcı');
    const reason = interaction.options.getString('sebep');

    // Yetkililere uyarı verilmesini engelle
    if (user.roles.cache.has(modRole.id)) {
      return interaction.reply({ content: "Yetkililere uyarı verilemez.", ephemeral: true });
    }

    if (!user || !reason) {
      return interaction.reply({ content: "Lütfen bir kullanıcı seçin ve uyarı sebebini belirtin.", ephemeral: true });
    }

    const guildKey = `${interaction.guild.id}.${user.id}`;
    const warningCount = db.get(guildKey) || 0;

    db.add(guildKey, 1);
    const updatedWarningCount = warningCount + 1;

    // Mod-log mesajı
    const logEmbed = new EmbedBuilder()
      .setColor('#FF0000')  // Kırmızı renk
      .setTitle('Uyarı Bilgisi')
      .setDescription(`**Uyarı Verilen Kullanıcı:** ${user}\n**Yeni Uyarı Sayısı:** ${updatedWarningCount}`)
      .addFields(
        { name: 'Uyarı Sebebi', value: reason, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: `Uyarı Sistemi`, iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 2048 }) });

    const logChannelID = db.get(`logChannel_${interaction.guild.id}`);
    const logChannel = interaction.guild.channels.cache.get(logChannelID);

    if (logChannel) {
      logChannel.send({ embeds: [logEmbed] });
    } else {
      console.error('Log kanalı bulunamadı.');
    }

    // Kullanıcıya DM mesajı
    const dmEmbed = new EmbedBuilder()
      .setColor('#00FF00')  // Yeşil renk
      .setTitle('Uyarı Aldınız')
      .setDescription(`Merhaba ${user},\n\n**Sunucudan Aldığınız Uyarı:**\n**Sebep:** ${reason}\n**Uyarı Sayınız:** ${updatedWarningCount}`)
      .setTimestamp()
      .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ format: 'png', dynamic: true, size: 2048 }) });

    try {
      await user.send({ embeds: [dmEmbed] });
    } catch (err) {
      console.error('DM mesajı gönderilemedi:', err);
    }

    const muteRoleID = db.get(`Mute_${interaction.guild.id}`);
    const jailRoleID = db.get(`Jail_${interaction.guild.id}`);
    const muteRole = interaction.guild.roles.cache.get(muteRoleID);
    const jailRole = interaction.guild.roles.cache.get(jailRoleID);

    let responseMessage = `${user} üyesine uyarı verildi. Uyarı Sayısı: ${updatedWarningCount}`;

    if (updatedWarningCount === 3 && muteRole) {
      // Kullanıcının mevcut rollerini sakla
      const userRoles = user.roles.cache.map(role => role.id);
      // Mute rolünü ver
      user.roles.add(muteRole).catch(console.error);
      // Diğer rollerini kaldır
      user.roles.set([muteRole.id]).catch(console.error);
      // Roller geri ver
      setTimeout(() => {
        user.roles.set(userRoles).catch(console.error);
      }, ms('2h'));
      responseMessage = `${user} üyesi \`3\` uyarı sayısına ulaştığı için <@&${muteRoleID}> rolü verildi. 2 saat sonra diğer roller geri verilecek.`;
    } else if (updatedWarningCount === 5 && muteRole) {
      // Kullanıcının mevcut rollerini sakla
      const userRoles = user.roles.cache.map(role => role.id);
      // Mute rolünü ver
      user.roles.add(muteRole).catch(console.error);
      // Diğer rollerini kaldır
      user.roles.set([muteRole.id]).catch(console.error);
      // Roller geri ver
      setTimeout(() => {
        user.roles.set(userRoles).catch(console.error);
      }, ms('1d'));
      responseMessage = `${user} üyesi \`5\` uyarı sayısına ulaştığı için <@&${muteRoleID}> rolü verildi. 1 gün sonra diğer roller geri verilecek.`;
    } else if (updatedWarningCount === 7 && jailRole) {
      // Kullanıcının mevcut rollerini sakla
      const userRoles = user.roles.cache.map(role => role.id);
      // Jail rolünü ver
      user.roles.add(jailRole).catch(console.error);
      // Diğer rollerini kaldır
      user.roles.set([jailRole.id]).catch(console.error);
      // Roller geri ver
      setTimeout(() => {
        user.roles.set(userRoles).catch(console.error);
      }, ms('1w'));
      responseMessage = `${user} üyesi \`7\` uyarı sayısına ulaştığı için <@&${jailRoleID}> rolü verildi. 1 hafta sonra diğer roller geri verilecek.`;
    } else if (updatedWarningCount === 9) {
      interaction.guild.members.ban(user.id, { reason: 'Otomatik ceza sistemi' }).catch(console.error);
      responseMessage = `${user} üyesi \`9\` uyarı sayısına ulaştığı için banlandı.`;
    }

    interaction.reply({ content: responseMessage }).then((e) => setTimeout(() => { e.delete(); }, 12000));
  },
};
