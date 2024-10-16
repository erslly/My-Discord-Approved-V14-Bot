const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const userSchema = require('../../Models/user');

const animals = [
  { name: 'Köpek', emoji: '🐶', coinValue: 10 },
  { name: 'Panda', emoji: '🐼', coinValue: 150 },
  { name: 'Kaplumbağa', emoji: '🐢', coinValue: 70 },
  { name: 'Kuş', emoji: '🐦', coinValue: 80 },
  { name: 'Fil', emoji: '🐘', coinValue: 90 },
  { name: 'Köpekbalığı', emoji: '🦈', coinValue: 100 },
  { name: 'Penguen', emoji: '🐧', coinValue: 110 },
  { name: 'Koala', emoji: '🐨', coinValue: 120 },
  { name: 'Yılan', emoji: '🐍', coinValue: 130 },
  { name: 'Timsah', emoji: '🐊', coinValue: 140 },
  { name: 'Panda', emoji: '🐼', coinValue: 150 },
];

const cooldowns = new Map(); // Kullanıcı başına cooldown saklamak için bir Map oluştur

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avla')
    .setDescription('Rastgele hayvanlar avlayarak coin kazan'),

  async execute(interaction) {
    const user = interaction.user;
    const currentTime = Date.now();
    const cooldownAmount = 5000; // 5 saniye cooldown

    if (cooldowns.has(user.id)) {
      const expirationTime = cooldowns.get(user.id) + cooldownAmount;

      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return interaction.reply({ content: `Bu komutu tekrar kullanmak için ${timeLeft.toFixed(1)} saniye beklemelisin.`, ephemeral: true });
      }
    }

    cooldowns.set(user.id, currentTime); // Kullanıcının son kullanım zamanını güncelle

    let userData = await userSchema.findOne({ id: user.id });
    if (!userData) {
      userData = await userSchema.create({ id: user.id, coin: 0 });
    }

    // Borç kontrolü
    if (userData.debt > 0) {
      // Borç süresi kontrolü
      if (!userData.debtPaidUntil || userData.debtPaidUntil > currentTime) {
        return interaction.reply({ content: `48 saat içinde borcunuzu ödemeniz gerekiyor. Borcunuz: ${userData.debt} coin.`, ephemeral: true });
      } else {
        // Borç süresi dolmuşsa, borcu sıfırla
        userData.debt = 0;
        userData.debtPaidUntil = null;
        await userData.save();
      }
    }

    // Avlama işlemleri
    const avlananHayvanlar = [];
    let totalEarnedCoin = 0;

    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
      totalEarnedCoin += randomAnimal.coinValue;
      avlananHayvanlar.push(`${randomAnimal.emoji} ${randomAnimal.name}`);
      await userSchema.findOneAndUpdate({ id: user.id }, { $inc: { coin: randomAnimal.coinValue } });
    }

    const infoEmbed = new EmbedBuilder()
      .setDescription(`**Avladığın Hayvanlar**\n${avlananHayvanlar.join('\n')}\n\n**${totalEarnedCoin}** coin kazandınız.`)
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setColor(0x00FF00)
      .setTimestamp()
      .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.avatarURL({ dynamic: true }) });

    await interaction.reply({ embeds: [infoEmbed] });
  }
};
