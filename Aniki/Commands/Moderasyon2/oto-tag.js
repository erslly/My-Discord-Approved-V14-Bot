const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oto-tag')
        .setDescription('Sunucuya giren üyelere otomatik tag verir!')
        .addStringOption(option => 
            option.setName('tag')
                .setDescription('Lütfen bir tag girin!')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Check if the user has the "Manage Nicknames" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({
                content: "<a:no:1268231541524402246> | İsimleri Yönet Yetkin Yok!",
                ephemeral: true
            });
        }

        // Get the tag from the interaction options
        const tag = interaction.options.getString('tag');

        // Set the oto-tag in the database for this guild
        db.set(`ototag_${interaction.guild.id}`, tag);

        // Create an embed message to inform the user
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`<a:evet:1268233923721433231> | Başarıyla tagı ${tag} olarak ayarladım!`);

        // Reply with the embed message
        interaction.reply({ embeds: [embed] });
    }
};
