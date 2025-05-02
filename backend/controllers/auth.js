const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.generateAuthToken = async (req, res) => {
  try {
    const token = crypto.randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Токен действует 15 минут

    const tempUser = new User({
      username: `telegram_temp_${token}`,
      password: 'telegram_temp_password',
      telegramAuthToken: token,
      telegramAuthTokenExpires: expiresAt
    });

    await tempUser.save();

    res.json({
      token,
      authUrl: `https://t.me/${process.env.TELEGRAM_BOT_NAME}?start=auth_${token}`,
      expiresAt
    });
  } catch (error) {
    console.error('Error generating auth token:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Отладочный вывод
    console.log('Login attempt for:', username);
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      token,
      userId: user._id
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message 
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка наличия данных
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Проверка существующего пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Создание нового пользователя (пароль автоматически хешируется благодаря pre-save хуку)
    const user = new User({ username, password });
    await user.save();

    // Генерация токена
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      token,
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.checkAuthStatus = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.user.id,
      telegramId: { $exists: true }
    });

    res.json({ isAuthenticated: !!user });
  } catch (error) {
    res.status(500).json({ message: 'Error checking auth status' });
  }
};