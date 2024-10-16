const { CommandInteraction, PermissionsBitField, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  name: "interactionCreate",

  execute(interaction, client) {

    const { customId, values, guild, member } = interaction;

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        return;
      }

      command.execute(interaction, client);
    } 
    else if (interaction.isStringSelectMenu()) {
      if (customId === "roller") {
        for (let i = 0; i < values.length; i++) {
          const roleId = values[i];
          const role = guild.roles.cache.get(roleId);
          const hasRole = member.roles.cache.has(roleId);

          if (hasRole) {
            member.roles.remove(roleId);
          } else {
            member.roles.add(roleId);
          }
        }
        interaction.reply({ content: "Roller güncellendi.", ephemeral: true });
      }
    }
    else if (interaction.isButton()) {
      if (customId.startsWith('rol_')) { // Button ID starts with "rol_"
        const roleId = customId.split('_')[1];
        const role = guild.roles.cache.get(roleId);

        if (role) {
          const hasRole = member.roles.cache.has(roleId);
          if (hasRole) {
            member.roles.remove(roleId);
            interaction.reply({ content: `${role.name} sizden alındı.`, ephemeral: true });
          } else {
            member.roles.add(roleId);
            interaction.reply({ content: `${role.name} size verildi.`, ephemeral: true });
          }
        } else {
          interaction.reply({ content: 'Bu rol bulunamadı veya silinmiş olabilir.', ephemeral: true });
        }
      } 
    }
    else {
      return;
    }
  },
};
