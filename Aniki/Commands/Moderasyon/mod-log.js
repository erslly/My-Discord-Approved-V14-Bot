const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mod-log")
        .setDescription("Moderasyon kanalını ayarlarsınız.")
        .addChannelOption(option =>
            option.setName("kanal")
                .setDescription("Mod logunu ayarlayacağınız kanal.")
                .setRequired(true)
                .addChannelTypes(0) // 0 - GUILD_TEXT
        ),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "<a:no:1268231541524402246> | Kanalları Yönetme yetkiniz yok!", ephemeral: true });
        }

        const kanal2 = interaction.options.getChannel('kanal');
        db.set(`modlogK_${interaction.guild.id}`, kanal2.id);

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`<a:evet:1268233923721433231> | Moderasyon kanalı <#${kanal2.id}> olarak ayarlandı!`);
        
        await interaction.reply({ embeds: [embed] });
    }
};
