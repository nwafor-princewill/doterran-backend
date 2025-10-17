import express from 'express';
import Subscriber from '../models/Subscriber';
import { EmailService } from '../services/emailService';

const router = express.Router();

// Send newsletter to all subscribers
router.post('/send', async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ 
        message: 'Subject and content are required' 
      });
    }

    // Get all active subscribers
    const subscribers = await Subscriber.find({ isActive: true });
    
    if (subscribers.length === 0) {
      return res.status(400).json({ 
        message: 'No active subscribers found' 
      });
    }

    const subscriberEmails = subscribers.map(sub => sub.email);
    
    // Create beautiful email template
    const htmlContent = EmailService.createPhilosophyTemplate(subject, content);
    
    // Send newsletter
    const result = await EmailService.sendNewsletter(subscriberEmails, {
      subject,
      htmlContent
    });

    res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`,
      result
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    res.status(500).json({ 
      message: 'Failed to send newsletter', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get newsletter stats
router.get('/stats', async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ isActive: true });
    
    res.json({
      totalSubscribers,
      activeSubscribers,
      inactiveSubscribers: totalSubscribers - activeSubscribers
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to get newsletter stats', 
      error 
    });
  }
});

export default router;