const express = require('express');
const authController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();
router.get('/telegram/generate-token', authMiddleware, authController.generateAuthToken);
router.post('/telegram/generate-token', authMiddleware, authController.generateAuthToken);
router.get('/telegram/check-status', authMiddleware, authController.checkAuthStatus);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/test-register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = new User({ username, password });
      await user.save();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
module.exports = router;