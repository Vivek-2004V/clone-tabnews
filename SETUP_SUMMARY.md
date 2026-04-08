# 🚀 Clone TabNews - Complete Backend Setup

**A Developer Community Platform** (Like abNews) with Free Backend

## What You Just Got? 

✅ **Complete API Backend** - 6 endpoints for all community features
✅ **TypeScript Support** - Full type safety
✅ **Database Schema** - Production-ready PostgreSQL setup
✅ **API Documentation** - Detailed guides for all endpoints
✅ **Postman Collection** - Ready to import for testing
✅ **Free Tier** - No paid services, open-source

---

## 📋 What's Included

### API Endpoints (6 Endpoints)

1. **Users API** (`/api/users`)
   - Create user with API key
   - List all users
   - Get user profile

2. **Feed/Posts API** (`/api/feed`)
   - Create posts
   - Get all posts with filtering
   - Filter by category, search, sort
   - Update posts
   - Delete posts

3. **Comments API** (`/api/comments`)
   - Get comments for a post
   - Add comments (with nested replies)
   - Delete comments
   - Comment counter

4. **Upvotes API** (`/api/upvote`)
   - Upvote posts
   - Upvote comments
   - Remove upvotes
   - Track upvote counts

5. **Bookmarks API** (`/api/bookmarks`)
   - Get user bookmarks
   - Save posts
   - Remove bookmarks

6. **Search API** (`/api/search`)
   - Search posts
   - Search users
   - Search comments
   - Filter by type

### Database Features

**6 Tables:**
- `users` - User accounts with API keys
- `posts` - Articles and blog posts
- `comments` - Comments (with nested replies support)
- `post_upvotes` - Post upvote tracking
- `comment_upvotes` - Comment upvote tracking
- `bookmarks` - Saved posts

**Includes:**
- Indexes for performance
- Foreign keys for data integrity
- Timestamps on all records
- View counters
- Upvote counters
- Comment counters

### Documentation
- `README.md` - Overview and quick start
- `API.md` - Detailed API documentation
- `schema.sql` - Database schema
- `postman_collection.json` - Postman tests
- `.env.example` - Configuration template

---

## 🛠️ How to Set Up

### Step 1: Install Node Dependencies
```bash
npm install
```

### Step 2: Create PostgreSQL Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE tabnews;"

# Create user (optional)
psql -U postgres -c "CREATE USER tabnews_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE tabnews TO tabnews_user;"

# Run schema
psql -U tabnews_user -d tabnews < schema.sql
```

### Step 3: Configure Environment
Update `.env.local`:
```env
DATABASE_URL=postgresql://tabnews_user:your_password@localhost:5432/tabnews
```

### Step 4: Start Development Server
```bash
npm run dev
```

Open: **http://localhost:3000** (or available port)

---

## 📡 API Usage

### Create a User (Get API Key)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_dev",
    "email": "john@example.com",
    "full_name": "John Developer"
  }'
```

### Create a Post
```bash
curl -X POST http://localhost:3000/api/feed \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Article",
    "content": "Full article content...",
    "author_id": 1,
    "category": "web-development",
    "tags": "javascript, react"
  }'
```

### Get All Posts
```bash
curl http://localhost:3000/api/feed
```

### Add Comment
```bash
curl -X POST http://localhost:3000/api/comments?post_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great article!",
    "author_id": 2
  }'
```

### Upvote Post
```bash
curl -X POST http://localhost:3000/api/upvote \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 1,
    "user_id": 2
  }'
```

### Search
```bash
curl "http://localhost:3000/api/search?q=react&type=posts"
```

---

## 📁 Project Files

```
├── pages/api/
│   ├── users.ts          - User management
│   ├── feed.ts           - Posts CRUD
│   ├── comments.ts       - Comments
│   ├── upvote.ts         - Upvoting
│   ├── bookmarks.ts      - Bookmarks
│   ├── search.ts         - Search
│   ├── health.ts         - Health check
│   └── db-test.ts        - DB connection test
├── lib/db.ts             - Database pool
├── schema.sql            - Database setup
├── API.md                - Full API docs
├── README.md             - Project overview
├── postman_collection.json - Testing
└── .env.local            - Configuration
```

---

## 🧪 Testing with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import `postman_collection.json`
3. Update localhost URL if needed
4. Send requests and see responses

---

## 🗄️ Database Diagram

```
users
├── id (PK)
├── username
├── email
├── api_key
├── bio
└── avatar_url

posts
├── id (PK)
├── title
├── content
├── author_id (FK → users)
├── category
├── tags
├── views_count
├── upvotes_count
├── comments_count
└── created_at

comments
├── id (PK)
├── content
├── author_id (FK → users)
├── post_id (FK → posts)
├── parent_comment_id (FK → comments)
├── upvotes_count
└── created_at

post_upvotes
├── id (PK)
├── user_id (FK → users)
├── post_id (FK → posts)
└── created_at (UNIQUE per user-post)

comment_upvotes
├── id (PK)
├── user_id (FK → users)
├── comment_id (FK → comments)
└── created_at (UNIQUE per user-comment)

bookmarks
├── id (PK)
├── user_id (FK → users)
├── post_id (FK → posts)
└── created_at (UNIQUE per user-post)
```

---

## 🚀 Deploy to Production

### Option 1: Deploy to Vercel (Free)
```bash
npm install -g vercel
vercel
# Follow the prompts
```

### Option 2: Deploy to Railway/Render (Free with credits)
1. Push to GitHub
2. Connect repository
3. Set DATABASE_URL
4. Deploy!

### Option 3: Self-host with Docker
```bash
docker build -t clone-tabnews .
docker run -p 3000:3000 -e DATABASE_URL=postgresql://... clone-tabnews
```

---

## 📚 Features Summary

| Feature | Status | Details |
|---------|--------|---------|
| User Management | ✅ Complete | Create users, get API keys |
| Posts CRUD | ✅ Complete | Create, read, update, delete |
| Comments | ✅ Complete | Nested replies supported |
| Upvotes | ✅ Complete | Posts & comments |
| Bookmarks | ✅ Complete | Save favorite posts |
| Search | ✅ Complete | Full-text search |
| Categories | ✅ Complete | Organize posts |
| Tags | ✅ Complete | Tag posts |
| Views Tracking | ✅ Complete | Track popularity |
| Authentication | ⏳ Todo | JWT/OAuth |
| Rate Limiting | ⏳ Todo | DDoS protection |
| Notifications | ⏳ Todo | Real-time updates |
| Admin Panel | ⏳ Todo | Moderation tools |

---

## 🎯 Next Steps

1. **Setup PostgreSQL** - Run database schema
2. **Test Endpoints** - Use Postman collection
3. **Build Frontend** - Create React components
4. **Add Auth** - Implement user login
5. **Deploy** - Push to production

---

## 📞 Common Issues

### PORT Already in Use
```bash
kill -9 $(lsof -t -i:3000)
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
cat .env.local
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

---

## 📚 Resources

- **API Docs:** [API.md](API.md)
- **Database Schema:** [schema.sql](schema.sql)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📄 License

MIT - Free to use for learning and projects

---

## 🎉 You're All Set!

Your developer community platform is ready to build! Start with the API endpoints and build your frontend. Good luck! 🚀

Questions? Check [API.md](API.md) for detailed documentation.
