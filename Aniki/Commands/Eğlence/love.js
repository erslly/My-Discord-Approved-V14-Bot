const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Belirtilen kişiler arasındaki aşk oranını hesaplar.')
    .addUserOption(option => 
      option.setName('kişi1')
        .setDescription('İlk kişi')
        .setRequired(true)
    )
    .addUserOption(option => 
      option.setName('kişi2')
        .setDescription('İkinci kişi')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user1 = interaction.options.getUser('kişi1');
    const user2 = interaction.options.getUser('kişi2');

    const lovePercentage = Math.floor(Math.random() * 101);

    let loveLevel;
    let loveEmoji;
    let loveColor;

    if (lovePercentage < 25) {
      loveLevel = "Zayıf";
      loveEmoji = "💔";
      loveColor = "#ff0000";
    } else if (lovePercentage < 50) {
      loveLevel = "Orta";
      loveEmoji = "💖";
      loveColor = "#ffa500";
    } else if (lovePercentage < 75) {
      loveLevel = "Yüksek";
      loveEmoji = "💗";
      loveColor = "#00ff00";
    } else {
      loveLevel = "Aşırı Yüksek";
      loveEmoji = "💞";
      loveColor = "#ff00ff";
    }

    const embed = new EmbedBuilder()
      .setTitle("Aşk Ölçer")
      .setDescription(`**${user1.username}** ile **${user2.username}** arasındaki aşk oranı: **${lovePercentage}%** ${loveEmoji}\n\n${loveLevel} Seviye Aşk!`)
      .setColor(loveColor)
      .setImage("https://media1.tenor.com/m/texWtYZgTZIAAAAC/anime-kiss.gif") 
      .setFooter({ text: `Komutu kullanan: ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};
