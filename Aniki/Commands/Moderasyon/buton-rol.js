const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buton-rol')
    .setDescription('Rol alma sistemini ayarlarsın!')
    .addStringOption(option =>
      option.setName('yazı')
        .setDescription('Lütfen bir embed mesaj yazısı gir!')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol1')
        .setDescription('Lütfen birinci rolü etiketle!')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol2')
        .setDescription('Lütfen ikinci rolü etiketle!')
        .setRequired(false))
    .addRoleOption(option =>
      option.setName('rol3')
        .setDescription('Lütfen üçüncü rolü etiketle!')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: "<a:no:1268231541524402246> | Rolleri Yönet Yetkin Yok!", ephemeral: true });
    }

    const yazı = interaction.options.getString('yazı');
    const rol1 = interaction.options.getRole('rol1');
    const rol2 = interaction.options.getRole('rol2');
    const rol3 = interaction.options.getRole('rol3');

    const embed = new EmbedBuilder()
      .setDescription(`${yazı}`)
      .setColor('Random');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel(rol1.name)
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`rol_${rol1.id}`)
    );

    if (rol2) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel(rol2.name)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`rol_${rol2.id}`)
      );
    }

    if (rol3) {
      row.addComponents(
        new ButtonBuilder()
          .setLabel(rol3.name)
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(`rol_${rol3.id}`)
      );
    }

    await interaction.reply({ embeds: [embed], components: [row] });

    // Store the role IDs in the database with the guild ID
    db.set(`buton_rol_${interaction.guild.id}`, {
      rol1: rol1.id,
      rol2: rol2 ? rol2.id : null,
      rol3: rol3 ? rol3.id : null,
    });
  },
};
