import express from 'express';
import Comment, { IComment } from '../models/Comment';
import BlogPost from '../models/BlogPost';

const router = express.Router();

// Get approved comments for a post
// router.get('/post/:postId', async (req, res) => {
//   try {
//     const { postId } = req.params;
    
//     const comments = await Comment.find({ 
//       postId, 
//       isApproved: true,
//       parentCommentId: null // Only top-level comments
//     })
//     .sort({ createdAt: -1 })
//     .populate({
//       path: 'replies',
//       match: { isApproved: true },
//       options: { sort: { createdAt: 1 } }
//     });

//     res.json(comments);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// Get approved comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    console.log('Fetching comments for post:', postId);
    
    const comments = await Comment.find({ 
      postId, 
      isApproved: true,
      parentCommentId: null
    })
    .sort({ createdAt: -1 })
    .lean();

    console.log(`Found ${comments.length} top-level comments`);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentCommentId: comment._id,
          isApproved: true
        })
        .sort({ createdAt: 1 })
        .lean();
        
        console.log(`Comment ${comment._id} has ${replies.length} replies`);
        
        return {
          ...comment,
          replies
        };
      })
    );

    res.json(commentsWithReplies);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  try {
    const { postId, author, email, content, parentCommentId } = req.body;

    // Validation
    if (!postId || !author || !email || !content) {
      return res.status(400).json({ 
        message: 'Post ID, author, email, and content are required' 
      });
    }

    // Check if post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = new Comment({
      postId,
      author: author.trim(),
      email: email.trim().toLowerCase(),
      content: content.trim(),
      parentCommentId: parentCommentId || null,
      isApproved: false // Moderate all comments first
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comment submitted for moderation',
      comment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Get all comments (for moderation)
router.get('/admin', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query: any = {};
    if (status === 'pending') query.isApproved = false;
    if (status === 'approved') query.isApproved = true;

    const comments = await Comment.find(query)
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Approve comment
router.patch('/:id/approve', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ 
      success: true, 
      message: 'Comment approved',
      comment 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Add admin reply
router.post('/:id/reply', async (req, res) => {
  try {
    const { content } = req.body;
    const parentComment = await Comment.findById(req.params.id);

    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    const reply = new Comment({
      postId: parentComment.postId,
      author: 'Doterra',
      email: 'thoughts@doterran.com',
      content: content.trim(),
      isApproved: true,
      isAdminReply: true,
      parentCommentId: parentComment._id
    });

    await reply.save();

    res.status(201).json({
      success: true,
      message: 'Reply added',
      reply
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Admin: Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Also delete any replies
    await Comment.deleteMany({ parentCommentId: comment._id });

    res.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;