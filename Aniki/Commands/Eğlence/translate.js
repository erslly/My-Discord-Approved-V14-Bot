const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('çeviri')
        .setDescription('Google Çeviri')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Çevirmek İstediğiniz Metin')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('language')
                .setDescription('Çeviri yapmak İstediğiniz Dil')
                .addChoices(
                    { name: 'English', value: 'en' },
                    { name: 'Turkish', value: 'tr' },
                    { name: 'Spanish', value: 'es' },
                    { name: 'French', value: 'fr' },
                    { name: 'German', value: 'de' },
                    { name: 'Italian', value: 'it' },
                    { name: 'Japanese', value: 'ja' },
                    { name: 'Arabic', value: 'ar' },
                    { name: 'Russian', value: 'ru' },
                    { name: 'Portuguese', value: 'pt' }
                )
                .setRequired(true)
        ),

    async execute(interaction) {
        const text = interaction.options.getString('text');
        const language = interaction.options.getString('language');

        await interaction.reply({ content: 'İstenilen Dile Çevriliyor <a:loading:1259128578709393418>', ephemeral: true });

        try {
            const applied = await translate(text, { to: language });

            const embed = new EmbedBuilder()
                .setColor('Green')
                .setTitle('<a:evet:1268233923721433231>  Çeviri Başarılı')
                .addFields(
                    { name: 'Girilen Metin', value: `\`\`\`${text}\`\`\``, inline: false },
                    { name: 'Çeviri Sonucu', value: `\`\`\`${applied.text}\`\`\``, inline: false }
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply({ content: 'Çeviri işlemi sırasında bir hata oluştu.', ephemeral: true });
        }
    }
};
