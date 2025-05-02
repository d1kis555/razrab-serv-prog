require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

// Добавьте проверку переменных окружения в самом начале
console.log('Env check:', {
  MONGODB_URI: process.env.MONGODB_URI ? 'exists' : 'missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'exists' : 'missing',
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN ? 'exists' : 'missing' // Добавьте эту проверку
});

const express = require('express');
const mongoose = require('mongoose');
const BotService = require('./services/botservice');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Роуты
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// Функция для запуска бота с повторными попытками
async function startBot() {
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN не найден в .env файле');
    }

    console.log('🔄 Попытка запуска Telegram бота...');
    const bot = new BotService(process.env.TELEGRAM_BOT_TOKEN);
    
    // Добавляем обработчик ошибок бота
    bot.bot.on('polling_error', (error) => {
      console.error('❌ Ошибка polling бота:', error.message);
    });
    
    return bot;
  } catch (error) {
    console.error('❌ Не удалось запустить Telegram бота:', error.message);
    console.log('⚠️ Авторизация через Telegram будет недоступна!');
    return null;
  }
}

// Подключение к MongoDB и запуск сервера
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Запускаем бота
    await startBot();

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error.message);
    process.exit(1);
  }
}

startServer();