const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Kimin kaç kişiyi davet ettiğini gösterir'),

    async execute(interaction) {
        const { guild, client } = interaction;

        await interaction.deferReply();

        let invites;
        let members;
        try {
            invites = await guild.invites.fetch();
            members = await guild.members.fetch();
        } catch (error) {
            console.error('Fetch error:', error);
            await interaction.editReply('Davetleri veya üyeleri alırken bir hata oluştu.');
            return;
        }

        const userInvites = [];

        try {
            members.forEach(member => {
                const userInvitesArray = invites.filter(u => u.inviter && u.inviter.id === member.user.id);
                let count = 0;
                userInvitesArray.forEach(invite => count += invite.uses);
                userInvites.push({ member: member.user, invites: count });
            });
        } catch (error) {
            console.error('Processing error:', error);
            await interaction.editReply('Üyeleri işlerken bir hata oluştu.');
            return;
        }

        userInvites.sort((a, b) => b.invites - a.invites);

        let currentPage = 0;
        const itemsPerPage = 10;
        const totalPages = Math.ceil(userInvites.length / itemsPerPage);

        const generateEmbed = (page) => {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage;
            const topInvites = userInvites.slice(start, end);

            let description = '';
            topInvites.forEach((value, index) => {
                description += `#${start + index + 1} Üye: **${value.member.username}**, Toplam Davet: \`${value.invites}\`\n`;
            });

            return new EmbedBuilder()
                .setColor('Random')
                .setDescription(`📕 **Toplam Davet Tablosu (Sayfa ${page + 1}/${totalPages})**\n\n${description}`);
        };

        let embed;
        try {
            embed = generateEmbed(currentPage);
        } catch (error) {
            console.error('Embed generation error:', error);
            await interaction.editReply('Embed oluştururken bir hata oluştu.');
            return;
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Önceki')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Sonraki')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === totalPages - 1)
            );

        let message;
        try {
            message = await interaction.editReply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Message sending error:', error);
            await interaction.editReply('Mesajı gönderirken bir hata oluştu.');
            return;
        }

        const filter = i => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            try {
                if (i.customId === 'prev') {
                    currentPage--;
                } else if (i.customId === 'next') {
                    currentPage++;
                }

                const newEmbed = generateEmbed(currentPage);

                const newRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Önceki')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Sonraki')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === totalPages - 1)
                    );

                await i.update({ embeds: [newEmbed], components: [newRow] });
            } catch (error) {
                console.error('Collector error:', error);
                try {
                    await interaction.editReply('Sayfaları güncellerken bir hata oluştu.');
                } catch (editError) {
                    console.error('Edit reply error:', editError);
                }
            }
        });

        collector.on('end', collected => {
            row.components.forEach(button => button.setDisabled(true));
            try {
                interaction.editReply({ components: [row] });
            } catch (error) {
                console.error('Edit reply on end error:', error);
            }
        });
    }
};
