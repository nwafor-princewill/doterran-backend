Backend API for the Dō Terra, Dō Anima philosophy blog — a Node.js + Express + MongoDB + TypeScript server that powers a modern, interactive philosophy platform. It handles blog posts, image uploads via Cloudinary, moderated comments with nested replies, newsletter subscriptions, and email delivery using Resend.

https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white


✨ Features
Feature	Description
📝 Blog Posts	Full CRUD with rich text, categories, tags, and featured images
🖼️ Image Uploads	Secure upload to Cloudinary with WebP conversion & optimization
💬 Comment System	Moderated comments with admin replies & nested replies
📧 Newsletter	Subscribe & send HTML newsletters via Resend
👨‍💼 Admin API	Full admin access to manage posts, comments, and subscribers
🎨 Email Templates	Beautiful philosophy-themed HTML emails
🛡️ Security	CORS, input validation, file type checks

🛠 Tech Stack
Technology	Purpose
https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white	Runtime Environment
https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white	Web Framework
https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white	Language
https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white	Database
https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white	Image Management
https://img.shields.io/badge/-Resend-000000?logo=resend&logoColor=white	Email Service
📁 Project Structure
text
doterran-backend/
├── src/
│   ├── models/
│   │   ├── BlogPost.ts        # Blog post schema
│   │   ├── Comment.ts         # Comment with replies & moderation
│   │   └── Subscriber.ts      # Newsletter subscribers
│   ├── routes/
│   │   ├── blogPosts.ts       # CRUD for posts + image upload
│   │   ├── comments.ts        # Comment moderation & replies
│   │   ├── newsletter.ts      # Send newsletter
│   │   └── subscribers.ts     # Subscribe & admin list
│   ├── services/
│   │   └── emailService.ts    # Resend integration + HTML templates
│   └── server.ts              # Express app & MongoDB connection
├── uploads/                   # Local fallback (not used with Cloudinary)
├── .env                       # Environment variables
├── package.json
├── tsconfig.json
└── README.md
🚀 Quick Start
Prerequisites
Node.js (v18+)

MongoDB (local or Atlas)

Cloudinary account

Resend account

1. Clone & Install
bash
git clone https://github.com/nwafor-princewill/doterran-backend.git
cd doterran-backend
npm install
2. Environment Setup
Create .env file:

env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/doterran-blog

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
3. Run Development
bash
npm run dev
Server runs at: http://localhost:5000

4. Build & Production
bash
npm run build
npm start
📡 API Endpoints
Blog Posts (/api/posts)
Method	Endpoint	Description
GET	/	List published posts (search, category, pagination)
GET	/:id	Get single post
GET	/admin	Get all posts (admin)
POST	/	Create post + upload image
PUT	/:id	Update post + optional image
DELETE	/:id	Delete post
Comments (/api/comments)
Method	Endpoint	Description
GET	/post/:postId	Get approved comments + replies
POST	/	Submit comment (awaiting moderation)
GET	/admin	Get all comments (filter by status)
PATCH	/:id/approve	Approve comment
POST	/:id/reply	Add admin reply
DELETE	/:id	Delete comment + replies
Newsletter (/api/newsletter)
Method	Endpoint	Description
POST	/send	Send newsletter to all active subscribers
GET	/stats	Get subscriber stats
Subscribers (/api/subscribe)
Method	Endpoint	Description
POST	/	Subscribe to newsletter
GET	/admin	List all subscribers (admin)
🖼 Image Uploads
Storage: Cloudinary with multer-storage-cloudinary

Format: Automatic WebP conversion

Size: Max 1200×630 pixels

Limit: 10MB file size

Types: jpeg, jpg, png, gif, webp

🚀 Deployment
Render / Railway / Fly.io
Push to GitHub

Connect repo to platform

Add environment variables

Set commands:

Build: npm run build

Start: npm start

CORS Configuration
Frontend URLs must be in allowlist:

http://localhost:3000

http://localhost:5173

https://doterran-frontend.vercel.app

📧 Email Features
Beautiful philosophy-themed HTML emails with:

Custom fonts (Georgia, Playfair Display)

Quote blocks

Parchment-style background

Responsive design

Unsubscribe & blog links

🛡 Security
CORS restricted to trusted origins

File type validation (images only)

Input sanitization and length limits

Comment moderation (all comments start unapproved)

Environment-based config

Error logging in routes

📜 Scripts
Script	Command	Purpose
Development	npm run dev	Start dev server with nodemon
Build	npm run build	Compile TypeScript to JavaScript
Start	npm start	Start production server
👥 Contributing
Fork the repo

Create a feature branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m "Add amazing feature"

Push to branch: git push origin feature/amazing-feature

Open a Pull Request

📞 Contact
Nwafor Princewill

GitHub: @nwafor-princewill

Email: nwaforprincewill21@gmail.com

📄 License
This project is licensed under the MIT License - see LICENSE for details.

"The unexamined API is not worth deploying." — Doterra

Live Demo: Frontend • Backend Repo
