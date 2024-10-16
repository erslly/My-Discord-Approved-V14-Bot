const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder, Events } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');
const saAsCommand = require('./Commands/Genel/sa-as.js');

const { Guilds, GuildMembers, GuildMessages, MessageContent, GuildMessageReactions, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel, DirectMessages } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates, MessageContent, GuildMessageReactions],
    partials: [User, Message, GuildMember, ThreadMember, Channel, DirectMessages],
    allowedMentions: {
        repliedUser: false,
    },
});

// DisTube yapılandırması
client.distube = new DisTube(client, {
    plugins: [
        new SpotifyPlugin(),
        new SoundCloudPlugin(),
    ],
});

// Bot hazır olduğunda çalışacak
client.once("ready", () => {
    console.log("Now Online: " + client.user.tag);
});

// Sunucuya katıldığında çalışacak
client.on('guildCreate', async guild => {
    const defaultChannel = guild.systemChannel;
    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
        .setColor('#e01444')
        .setTitle('Merhaba!')
        .setDescription("Beni sunucuna eklediğin için teşekkürler!\n'/' ön ekini kullanarak komutları çağırabilirsin.\n\nHerhangi bir kanala '/help' yazarak beni kullanmaya başlayabilirsin :)\n[Destek Sunucum](https://discord.gg/ryf4qrJWCC)");

    if (defaultChannel) {
        defaultChannel.send({ embeds: [embed] }).catch(console.error);
    }

    if (owner) {
        const dmEmbed = new EmbedBuilder()
            .setColor('#e01444')
            .setTitle('Teşekkürler!')
            .setDescription("Beni sunucuna eklediğin için teşekkürler!\nDestek Sunucum!: [Destek Sunucum](https://discord.gg/ryf4qrJWCC)");

        owner.send({ embeds: [dmEmbed] }).catch(console.error);
    }
});

// Mesajlar oluşturulduğunda çalışacak
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const guildId = message.guild.id;

    const greetings = ['sa', 'merhaba', 'selam', 'slm', 'merhabalar'];
    const isExactGreeting = greetings.some(greeting => message.content.toLowerCase() === greeting);

    if (isExactGreeting && saAsCommand.isSaAsEnabled(guildId)) {
        await message.reply(`Aleyküm selam ${message.author} <a:selam:1269693859378630727>`);
    }
});

client.commands = new Collection();
client.config = require('./config.json');

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});
