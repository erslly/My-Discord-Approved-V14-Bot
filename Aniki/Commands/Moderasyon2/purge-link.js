const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = 
{
    data: new SlashCommandBuilder()
       .setName('link-sil')
       .setDescription('Gönderilmiş Linkleri Siler (14 Gün Öncesi Hariç)')
       .addChannelOption(option => 
            option.setName('channel')
            .setDescription('Linklerin Silineceği Kanalı Seçin.')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
       ),

    async execute(interaction) 
    {
        const { options, guild } = interaction;
        const channel = options.getChannel('channel') || interaction.channel;
        const messages = await channel.messages.fetch();

        await interaction.deferReply({ ephemeral: true });

        let count = 0;
        let response = false;

        for (const [id, m] of messages) 
        {
            if (m.content.includes('https://') || m.content.includes('http://') || m.content.includes("discord.gg/")) 
            {
                await m.delete().catch(err => {});
                count++;
                response = true;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(response ? 'Green' : 'Red')
            .setDescription(response ? `**Link** içeren \`${count}\` adet mesaj silindi.` : 'Hiçbir link içeren mesaj bulunamadı.');

        await interaction.editReply({ embeds: [embed], ephemeral: true });
    }
}
