const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Belirtilen üyeye göre seviye ve puanları gösterir.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand => 
            subcommand.setName('add')
                .setDescription('Bir Üyeye Seviye Ekle.')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('Seviye Eklenecek Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('Seviye Miktarını Seç')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('remove')
                .setDescription('Bir Üyenin Belirli Miktarda Seviyesini Sil')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('Seviyesi Silinecek Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('Silinecek Seviye Miktarını Seç')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand => 
            subcommand.setName('set')
                .setDescription('Bir Üyenin Seviyesini Ayarla')
                .addUserOption(option => 
                    option.setName('user')
                        .setDescription('Seviyesi Ayarlanacak Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option => 
                    option.setName('amount')
                        .setDescription('Ayarlanacak Seviye Miktarını Seç')
                        .setMinValue(0)
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const { options, guildId } = interaction;

        const sub = options.getSubcommand();
        const target = options.getUser('user');
        const amount = options.getInteger('amount');
        const embed = new EmbedBuilder();

        try {
            switch (sub) {
                case 'add':
                    await Levels.appendLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyeye ${amount} Seviye **Eklenmiştir**`).setColor('Green').setTimestamp();
                    break;
                case 'remove':
                    await Levels.subtractLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyeden ${amount} Seviye **Çıkarılmıştır**`).setColor('Red').setTimestamp();
                    break;
                case 'set':
                    await Levels.setLevel(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyenin Seviyesi ${amount} Seviye Olarak **Ayarlanmıştır**`).setColor('Yellow').setTimestamp();
                    break;
            }
        } catch (err) {
            console.log(err);
            embed.setDescription('Bir hata oluştu. Lütfen tekrar deneyin.').setColor('Red').setTimestamp();
        }

        interaction.reply({ embeds: [embed] });
    }
};
