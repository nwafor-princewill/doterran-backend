import express from 'express';
import Subscriber from '../models/Subscriber';

const router = express.Router();

// Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Valid email is required' });
    }
    
    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    
    res.status(201).json({ message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all subscribers (admin only)
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add this route to see all subscribers (admin only)
router.get('/admin', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;