const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanal-açıklama')
    .setDescription('Kanal açıklamasını değiştirir.')
    .addChannelOption(option =>
      option.setName('kanal')
        .setDescription('Açıklamasını değiştirmek istediğiniz kanalı seçin.')
        .setRequired(true)
        .addChannelTypes(0) 
    )
    .addStringOption(option =>
      option.setName('açıklama')
        .setDescription('Yeni kanal açıklamasını girin.')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('<a:no:1268231541524402246> | Hata')
            .setDescription('Kanalları yönetme yetkiniz yok!')
        ],
        ephemeral: true
      });
    }


    const aciklama = interaction.options.getString('açıklama');
    const kanal = interaction.options.getChannel('kanal');

    try {

      await kanal.setTopic(aciklama);


      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('<a:evet:1268233923721433231>  | Başarılı')
            .setDescription(`<#${kanal.id}> kanalının açıklaması başarıyla **${aciklama}** olarak değiştirildi.`)
        ]
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('<a:no:1268231541524402246> | Hata')
            .setDescription('Kanal açıklaması güncellenirken bir hata oluştu.')
        ],
        ephemeral: true
      });
    }
  }
};
