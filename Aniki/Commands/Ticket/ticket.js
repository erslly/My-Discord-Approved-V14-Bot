const {SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, Guild} = require('discord.js');
const ticketSchema = require('../../Models/Ticket');

module.exports =
{
    data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription("Ticket İşlemleri")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => 
        option.setName('işlem')
        .setDescription("Ticket'a Üye Ekle veya Üye Çıkar")
        .setRequired(true)
        .addChoices(
            {name: 'ekle', value: 'ekle'},
            {name: 'çıkar', value: 'çıkar'}
        )
    )
    .addUserOption(option => 
        option.setName('üye')
        .setDescription("Bir Üye Seçin")
        .setRequired(true)
    ),

    async execute(interaction)
    {
        const {options, guildId, channel} = interaction;
        const member = options.getUser('üye');
        const action = options.getString('işlem');

        const embed = new EmbedBuilder()

        switch(action)
        {
            case 'ekle':
                    ticketSchema.findOne({Guild: guildId, ChannelID: channel.id}, async (err, data) => {
                        if(err) throw err;
                        if(!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz")], ephemeral: true});
                        if(data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz")], ephemeral: true});

                        data.MembersID.push(member.id);

                        channel.permissionOverwrites.edit(member.id, {
                            sendMessages: true,
                            ViewChannel: true,
                            ReadMessageHistory: true
                        });
                        
                        interaction.reply({embeds: [embed.setColor('Green').setDescription(`${member}, Ticket'a Eklendi`)], ephemeral: true});
                    });
                    break;

                    case 'çıkar':
                        ticketSchema.findOne({Guild: guildId, ChannelID: channel.id}, async (err, data) => {
                            if(err) throw err;
                            if(!data) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz")], ephemeral: true});
                            if(data.MembersID.includes(member.id)) return interaction.reply({embeds: [embed.setColor('Red').setDescription("Bir Hata Oluştu. Lütfen Daha Sonra Tekrar Deneyiniz")], ephemeral: true});
    
                            data.MembersID.remove(member.id);
    
                            channel.permissionOverwrites.edit(member.id, {
                                sendMessages: false,
                                ViewChannel: false,
                                ReadMessageHistory: false
                            });
                            
                            interaction.reply({embeds: [embed.setColor('Green').setDescription(`${member}, Ticket'tan Çıkarıldı`)], ephemeral: true});
                        });
                        break;
                    }
                }
            }