const {SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = 
{
    data: new SlashCommandBuilder()
    .setName('remain')
    .setDescription('Seviyelerin Kaç xp Olduğunu Gösterir.')
    .addIntegerOption(option => 
        option.setName('seviye')
       .setDescription("İstenilen Seviyenin xp'si")
       .setRequired(true)
    ),

    async execute(interaction)
    {
      const {options} = interaction;
      const level = options.getInteger('seviye');
      const xpAmount = Levels.xpFor(level); // Burada xpFor kullanılıyor

      interaction.reply({content: `Seviye **${level}** Düzeyine Ulaşmak İçin **${xpAmount}** xp Gerekiyor.`});
    }
};
