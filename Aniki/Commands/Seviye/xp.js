const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Levels = require('discord.js-leveling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription("Bir üyenin xp'sini Ayarla")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Bir Üyeye xp Ekle.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('xp Eklenecek Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Xp Miktarını Seç')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Bir Üyeden Belirli Bir xp Sil')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Xp Silinecek Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Xp Miktarını Seç')
                        .setMinValue(0)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription("Bir Üyenin Xp'sini Ayarla")
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('Xp Eklenecek Üyeyi Seç')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('Xp Miktarını Seç')
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
                    await Levels.appendXp(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyeye ${amount} xp **Eklenmiştir**`).setColor('Green').setTimestamp();
                    break;
                case 'remove':
                    await Levels.subtractXp(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyeden ${amount} xp **Çıkarılmıştır**`).setColor('Red').setTimestamp();
                    break;
                case 'set':
                    await Levels.setXp(target.id, guildId, amount);
                    embed.setDescription(`${target} Adlı Üyenin Xp'si ${amount} Olarak **Ayarlanmıştır**`).setColor('Yellow').setTimestamp();
                    break;
            }
        } catch (err) {
            console.log(err);
        }

        interaction.reply({ embeds: [embed] });
    }
};
