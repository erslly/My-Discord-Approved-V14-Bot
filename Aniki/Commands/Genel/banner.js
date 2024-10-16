const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('Belirttiğiniz kullanıcının bannerini gösterir.')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Bannerini göstermek istediğiniz kullanıcıyı seçin')
            .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const { DiscordBanners } = require('discord-banners');
            const discordBanners = new DiscordBanners(interaction.client);
            const user = interaction.options.getUser('user');
            const banner = await discordBanners.getBanner(user.id, { dynamic: true });

            if (banner) {
                const sizes = [64, 128, 256, 512, 1024, 2048];
                const buttons = sizes.map(size => 
                    new ButtonBuilder()
                        .setLabel(`PNG x${size}`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(banner.replace(/(\.gif|\.png|\.jpg)$/, `.png?size=${size}`))
                );

                const rows = [];
                while (buttons.length) {
                    rows.push(new ActionRowBuilder().addComponents(buttons.splice(0, 3)));
                }

                const embed = new EmbedBuilder()
                    .setDescription(`**<a:helel:1268237436937437255> <@${user.id}> adlı kullanıcının banneri!**`)
                    .setImage(banner)
                    .setColor('Random');
                    
                return interaction.reply({ embeds: [embed], components: rows });
            } else {
                const embed = new EmbedBuilder()
                    .setDescription(`<a:no:1268231541524402246> Bu kullanıcıda banner bulunmamaktadır!`);
                return interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setDescription(`<a:no:1268231541524402246> Bu kullanıcıda banner bulunamadı!`);
            return interaction.reply({ embeds: [embed] });
        }
    }
};
