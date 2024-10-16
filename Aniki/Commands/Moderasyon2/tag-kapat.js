const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oto-tag-kapat')
        .setDescription('Oto-tag sistemini kapatırsın!'),

    async execute(interaction) {
        // Check if the user has the "Manage Nicknames" permission
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({
                content: "<a:no:1268231541524402246> | İsimleri Yönet Yetkin Yok!",
                ephemeral: true
            });
        }

        // Delete the oto-tag setting from the database for this guild
        db.delete(`ototag_${interaction.guild.id}`);

        // Create an embed message to inform the user
        const embed = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`<a:evet:1268233923721433231> | Başarıyla sistemi sıfırladım!`);

        // Reply with the embed message
        interaction.reply({ embeds: [embed] });
    }
};
