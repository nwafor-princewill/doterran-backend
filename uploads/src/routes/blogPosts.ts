import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import BlogPost, { IBlogPost } from '../models/BlogPost';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: express.Request, file: Express.Multer.File) => {
    return {
      folder: 'doterran-blog',
      format: 'webp', // Convert to webp for better compression
      transformation: [
        { width: 1200, height: 630, crop: 'limit' }, // Optimize for blog images
      ],
    };
  },
} as any);

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let query: any = { isPublished: true };
    
    if (category && category !== 'All') {
      query.category = category as string;
    }
    
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { excerpt: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } }
      ];
    }
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all posts for admin
router.get('/admin', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Create new post with image upload
router.post('/', upload.single('featuredImage'), async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { title, excerpt, content, category, tags, readTime, isPublished } = req.body;
    
    // Validation
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['title', 'excerpt', 'content', 'category']
      });
    }
    
    const postData: any = {
      title,
      excerpt,
      content,
      category,
      tags: tags ? JSON.parse(tags) : [],
      readTime: parseInt(readTime) || 5,
      isPublished: isPublished === 'true',
      author: 'Doterra'
    };
    
    // Add featured image if uploaded, otherwise use placeholder
    if (req.file) {
      postData.featuredImage = (req.file as any).path; // Cloudinary URL
    } else {
      postData.featuredImage = '/api/placeholder/800/400';
    }
    
    // Set publishedAt if publishing
    if (isPublished === 'true') {
      postData.publishedAt = new Date();
    }
    
    const post = new BlogPost(postData);
    await post.save();
    
    console.log('Post created successfully:', post._id);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Update post
router.put('/:id', upload.single('featuredImage'), async (req, res) => {
  try {
    const updateData: any = { ...req.body };
    
    if (req.file) {
      updateData.featuredImage = (req.file as any).path; // Cloudinary URL
    }
    
    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }
    
    if (updateData.readTime) {
      updateData.readTime = parseInt(updateData.readTime);
    }
    
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;