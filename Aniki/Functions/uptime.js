// Bu fonksiyon, verilen milisaniye cinsinden süreyi gün, saat, dakika ve saniye olarak formatlar.
function formatUptime(ms) {
    const days = Math.floor(ms / (24 * 60 * 60 * 1000));
    const daysms = ms % (24 * 60 * 60 * 1000);
    const hours = Math.floor(daysms / (60 * 60 * 1000));
    const hoursms = ms % (60 * 60 * 1000);
    const minutes = Math.floor(hoursms / (60 * 1000));
    const minutesms = ms % (60 * 1000);
    const sec = Math.floor(minutesms / 1000);

    return `${days}d ${hours}h ${minutes}m ${sec}s`;
}

module.exports = {
    uptime: formatUptime,
};
