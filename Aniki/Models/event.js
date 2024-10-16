const mongoose = require('mongoose');
const config = require('../config.json'); // config.json dosyasını yükleyin

// Event şeması tanımı ve model oluşturma
const eventSchema = new mongoose.Schema({
    channelId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    eventNumber: { // Etkinlik sayısını ekleyin
        type: Number,
        default: null
    }
});

// Event modelini oluştur
const Event = mongoose.model('Event', eventSchema);

// Etkinlik ayarlarını güncelle veya oluştur
async function setEventSettings(channelId, roleId, eventNumber) {
    try {
        await Event.findOneAndUpdate(
            {}, // Şart yok, tek bir genel veri güncellenir
            { channelId, roleId, eventNumber },
            { upsert: true, new: true } // Kullanıcı verisi yoksa oluştur ve güncel döndür
        );
    } catch (err) {
        console.error('Etkinlik ayarlarını güncellerken bir hata oluştu:', err);
        throw new Error('Etkinlik ayarlarını güncellerken bir hata oluştu.');
    }
}

// Etkinlik ayarlarını getir
async function getEventSettings() {
    try {
        const event = await Event.findOne({});
        return event ? event : null;
    } catch (err) {
        console.error('Etkinlik ayarlarını getirirken bir hata oluştu:', err);
        throw new Error('Etkinlik ayarlarını getirirken bir hata oluştu.');
    }
}

// Bağlantı kur ve kapatma işlevleri
async function connectToDatabase() {
    try {
        await mongoose.connect(config.mongodbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB bağlantısı başarılı.');
    } catch (err) {
        console.error('MongoDB bağlantısı sırasında bir hata oluştu:', err);
        throw new Error('MongoDB bağlantısı sırasında bir hata oluştu.');
    }
}

async function disconnectFromDatabase() {
    try {
        await mongoose.disconnect();
        console.log('MongoDB bağlantısı kapatıldı.');
    } catch (err) {
        console.error('MongoDB bağlantısını kapatma sırasında bir hata oluştu:', err);
        throw new Error('MongoDB bağlantısını kapatma sırasında bir hata oluştu.');
    }
}

module.exports = { setEventSettings, getEventSettings, connectToDatabase, disconnectFromDatabase };
