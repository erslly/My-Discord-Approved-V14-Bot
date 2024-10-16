const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const client = require('../../index');

const radioChannels = {
    'Radyo Fenomen(TR)': 'https://live.radyofenomen.com/fenomen/128/icecast.audio?%20/;stream.mp3',
    'Radyo Show(TR)': 'https://showradyo.radyotvonline.net/showradyoaac?/;stream.mp3',
    'Radyo Metro(TR)': 'https://27993.live.streamtheworld.com/METRO_FM128AAC.aac',
    'Radyo Alem(TR)': 'https://turkmedya.radyotvonline.net/alemfmaac?/;stream.mp3'
};

let connection;
let player;
let currentVolume = 0.5;
let previousVolume = {};
let selectedChannel; 
let url; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radyo')
        .setDescription('Radyo kanalında dinlemek için kullanın'),

    async execute(interaction) {
        const { guild, member } = interaction;
        const radioOptions = Object.keys(radioChannels).map(channels => ({
            label: channels.toUpperCase(),
            value: channels
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('radio-menu')
                    .setPlaceholder('Radyo Kanalı Seçiniz')
                    .addOptions(radioOptions)
            );

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Radyo Seçeneği')
            .setDescription('Radyo kanalını seçerek dinlemek için bir radyo kanalı seçin.')
            .setTimestamp();

        const volumeDownButton = new ButtonBuilder()
            .setCustomId('volume-down')
            .setEmoji('🔉')
            .setStyle(ButtonStyle.Secondary);

        const volumeUpButton = new ButtonBuilder()
            .setCustomId('volume-up')
            .setEmoji('🔊')
            .setStyle(ButtonStyle.Secondary);

        const stopButton = new ButtonBuilder()
            .setCustomId('stop')
            .setEmoji('⏹️')
            .setStyle(ButtonStyle.Danger);

        const buttonRow = new ActionRowBuilder()
            .addComponents(volumeDownButton, volumeUpButton, stopButton);

        await interaction.reply({ embeds: [embed], components: [buttonRow, row] });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'radio-menu') {
                selectedChannel = i.values[0]; 
                url = radioChannels[selectedChannel]; 

                try {
                    if (!member.voice.channel) {
                        throw new Error('Ses Kanalında Kimse Yok!');
                    }

                    connection = joinVoiceChannel({
                        channelId: member.voice.channelId,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator
                    });

                    player = createAudioPlayer();
                    connection.subscribe(player);

                    let volume = currentVolume;
                    if (previousVolume[selectedChannel]) {
                        volume = previousVolume[selectedChannel];
                    } else {
                        previousVolume[selectedChannel] = currentVolume;
                    }

                    const resource = createAudioResource(url, { inlineVolume: true });
                    resource.volume.setVolume(volume);
                    player.play(resource);

                    embed.setDescription(`<a:next:1256700028844773477> Seçilen Radyo İstasyonu: ${selectedChannel}\n <a:volume:1268240738009747496> Ses Seviyesi: ${(currentVolume * 100).toFixed(0)}%`);
                    await i.update({ embeds: [embed], components: [buttonRow, row] });

                } catch (e) {
                    console.error(e);
                    await interaction.followUp({ content: e.message, ephemeral: true });
                }
            } else if (i.customId === 'volume-up' || i.customId === 'volume-down' || i.customId === 'stop') {
                const { customId } = i;
                if (!player) {
                    return await i.update({ content: 'Önce bir radyo kanalı seçmelisiniz.', components: [], embeds: [] });
                }

                switch (customId) {
                    case 'volume-up':
                        if (currentVolume < 1) {
                            currentVolume = Math.min(currentVolume + 0.1, 1);
                            player.state.resource.volume.setVolume(currentVolume);
                            embed.setDescription(`<a:next:1256700028844773477> Seçilen Radyo İstasyonu: ${selectedChannel}\n <a:volume:1268240738009747496> Ses Seviyesi: ${(currentVolume * 100).toFixed(0)}%`);
                        }
                        break;

                    case 'volume-down':
                        if (currentVolume > 0) {
                            currentVolume = Math.max(currentVolume - 0.1, 0);
                            player.state.resource.volume.setVolume(currentVolume);
                            embed.setDescription(`<a:next:1256700028844773477> Seçilen Radyo İstasyonu: ${selectedChannel}\n <a:volume:1268240738009747496> Ses Seviyesi: ${(currentVolume * 100).toFixed(0)}%`);
                        }
                        break;

                    case 'stop':
                        player.stop();
                        connection.destroy();
                        embed.setDescription('Radyo durduruldu.');
                        await i.update({ embeds: [embed], components: [] });
                        return;
                }
                await i.update({ embeds: [embed], components: [buttonRow, row] });
            }
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await interaction.followUp({ content: 'Bir Kanal Seçilmedi', ephemeral: true });
            }
        });
    }
};
