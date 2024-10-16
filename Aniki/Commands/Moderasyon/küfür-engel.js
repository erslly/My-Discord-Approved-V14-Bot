const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require('discord.js');
const db = require('croxydb');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('küfür-engel')
    .setDescription('Küfür Engel Sistemini Açıp Kapatırsın!')
    .addStringOption(option =>
      option.setName('seçenek')
        .setDescription('Sistemi kapatacak mısın yoksa açacak mısın?')
        .setRequired(true)
        .addChoices(
          { name: 'Aç', value: 'ac' },
          { name: 'Kapat', value: 'kapat' }
        )),
  async execute(interaction) {
    const { user, guild, options } = interaction;

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: '<a:no:1268231541524402246> | Rolleri Yönet Yetkin Yok!', ephemeral: true });
    }

    const kufurEngelSystemTrue = options.getString('seçenek');
    const kufurEngelSystem = db.fetch(`kufurengel_${interaction.guild.id}`);
    const kufurengelDate = db.fetch(`kufurengelDate_${interaction.guild.id}`);

    switch (kufurEngelSystemTrue) {
      case 'ac': {
        if (kufurEngelSystem && kufurengelDate) {
          const date = new EmbedBuilder()
            .setDescription(`<a:no:1268231541524402246> | Bu sistem <t:${parseInt(kufurengelDate.date / 1000)}:R> önce açılmış!`);
          
          return interaction.reply({ embeds: [date] });
        }

        db.set(`kufurengel_${interaction.guild.id}`, true);
        db.set(`kufurengelDate_${interaction.guild.id}`, { date: Date.now() });
        return interaction.reply({ content: '<a:evet:1268233923721433231> | Başarılı bir şekilde sistem açıldı!' });
      }

      case 'kapat': {
        if (!kufurEngelSystem) {
          return interaction.reply({ content: '<a:no:1268231541524402246> | Bu sistem zaten kapalı?' });
        }

        db.delete(`kufurengel_${interaction.guild.id}`);
        db.delete(`kufurengelDate_${interaction.guild.id}`);
        return interaction.reply({ content: '<a:evet:1268233923721433231> | Başarılı bir şekilde sistem kapatıldı!' });
      }
    }
  },
};
