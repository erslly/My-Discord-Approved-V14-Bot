const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Kullanıcı ID'sinin benzersiz olduğunu garanti altına alır
        index: true   // Sorgu performansını artırmak için indeks ekler
    },
    coin: {
        type: Number,
        default: 0,   // Yeni kullanıcılar için varsayılan coin değeri
        min: 0        // Coin miktarının 0'dan küçük olmamasını sağlar
    },
    debt: {
        type: Number,
        default: 0,   // Yeni kullanıcılar için varsayılan borç değeri
        min: 0        // Borcun 0'dan küçük olmamasını sağlar
    },
    lastDebtCalculation: {
        type: Date,
        default: null // Son borç hesaplama tarihi
    },
    lastDaily: { // Günlük ödül tarihi
        type: Date,
        default: null
    }
}, {
    timestamps: true  // createdAt ve updatedAt zaman damgalarını otomatik olarak yönetir
});

module.exports = mongoose.model('User', userSchema);
