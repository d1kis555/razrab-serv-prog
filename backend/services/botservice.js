const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/user');

class BotService {
  constructor(token) {
    if (!token) {
      console.error('❌ Telegram Bot Token не предоставлен!');
      throw new Error('Telegram token is required');
    }

    this.bot = new TelegramBot(token, { polling: true });
    console.log('🤖 Бот инициализирован с токеном:', token.substring(0, 5) + '...');

    this.setupHandlers();

    // Проверка соединения
    this.bot.getMe().then(me => {
      console.log(`✅ Бот @${me.username} успешно запущен!`);
    }).catch(err => {
      console.error('❌ Ошибка подключения бота:', err.message);
    });
  }

  setupHandlers() {
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;

      if (msg.text === '/start') {
        this.bot.sendMessage(chatId, 'Привет! Для авторизации на сайте используйте команду /auth');
        return;
      }

      if (msg.text.startsWith('/auth ')) {
        const token = msg.text.split(' ')[1];
        await this.handleAuth(chatId, token);
      }
    });
  }

  async handleAuth(chatId, token) {
    try {
      const user = await User.findOneAndUpdate(
        { telegramAuthToken: token },
        {
          $set: { telegramId: chatId },
          $unset: { telegramAuthToken: 1 }
        },
        { new: true }
      );

      if (user) {
        this.bot.sendMessage(chatId, '✅ Вы успешно авторизованы! Можете вернуться на сайт.');
      } else {
        this.bot.sendMessage(chatId, '❌ Неверный токен авторизации');
      }
    } catch (error) {
      console.error('Auth error:', error);
      this.bot.sendMessage(chatId, '⚠️ Произошла ошибка при авторизации');
    }
  }
}

module.exports = BotService;