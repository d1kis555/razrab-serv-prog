require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
console.log('Env check:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'exists' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing'
});
const express = require('express');
const mongoose = require('mongoose');
const BotService = require('./services/botservice');

const app = express();

// Middleware должны быть ПЕРЕД роутами
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Подключаем роуты ПОСЛЕ middleware
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Connection URI:', process.env.MONGODB_URI); // Добавьте эту строку
  });
// Telegram бот
try {
  new BotService(process.env.TELEGRAM_BOT_TOKEN);
} catch (error) {
  console.error('Failed to start Telegram bot:', error.message);
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});