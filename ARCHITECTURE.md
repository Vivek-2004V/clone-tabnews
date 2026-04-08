# Architecture Guide - Developer Community Platform

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│                    (To be built by you)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP/HTTPS
                         │ (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /api/users        │ User management                      │  │
│  │ /api/feed         │ Posts CRUD                          │  │
│  │ /api/comments     │ Comments & replies                  │  │
│  │ /api/upvote       │ Upvoting system                     │  │
│  │ /api/bookmarks    │ Save favorite posts                 │  │
│  │ /api/search       │ Full-text search                    │  │
│  │ /api/health       │ Server status                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ SQL Queries
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE                                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ users          │ User accounts with API keys            │ │
│  │ posts          │ Articles and blog posts                │ │
│  │ comments       │ Comments with nested replies           │ │
│  │ post_upvotes   │ Post upvote tracking                  │ │
│  │ comment_upvotes│ Comment upvote tracking               │ │
│  │ bookmarks      │ Saved posts                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagram

### Creating a Post

```
1. User clicks "Create Post" in Frontend
   ↓
2. Frontend sends POST request to /api/feed
   {
     "title": "My Article",
     "content": "Article content...",
     "author_id": 1,
     "category": "web-development",
     "tags": "javascript, react"
   }
   ↓
3. Backend receives request in pages/api/feed.ts
   ↓
4. Validates input
   ↓
5. Executes INSERT query to database
   INSERT INTO posts (title, content, author_id, category, tags)
   VALUES ($1, $2, $3, $4, $5)
   ↓
6. Database creates record and returns new post
   ↓
7. Backend sends response with post details
   {
     "success": true,
     "data": {
       "id": 123,
       "title": "My Article",
       "content": "Article content...",
       "author_id": 1,
       "category": "web-development",
       "created_at": "2024-01-01T12:00:00Z"
     }
   }
   ↓
8. Frontend receives and displays post
```

---

## Data Flow Examples

### Example 1: Getting Posts with Filters

```
Frontend Request:
GET /api/feed?category=web-development&sort=trending

Backend Processing:
1. Parse query parameters
2. Build SQL query based on filters
3. Execute: SELECT * FROM posts 
   WHERE category = 'web-development'
   ORDER BY upvotes_count DESC
   LIMIT 50
4. Return filtered posts

Response sent to Frontend:
[
  {
    "id": 1,
    "title": "Post 1",
    "upvotes_count": 150,
    "views_count": 500
  },
  {
    "id": 2,
    "title": "Post 2",
    "upvotes_count": 120,
    "views_count": 300
  }
]
```

### Example 2: Commenting on a Post

```
Frontend Request:
POST /api/comments?post_id=1
{
  "content": "Great article!",
  "author_id": 2
}

Backend Processing:
1. Validate post_id and author_id exist
2. INSERT comment into database
3. Increment post's comment_count
4. Return comment details

Response:
{
  "success": true,
  "data": {
    "id": 456,
    "content": "Great article!",
    "author_id": 2,
    "post_id": 1,
    "created_at": "2024-01-01T12:30:00Z"
  }
}

Database Changes:
- New row in comments table
- posts.comments_count increases by 1 (123 → 124)
```

### Example 3: Upvoting a Post

```
Frontend Request:
POST /api/upvote
{
  "post_id": 1,
  "user_id": 2
}

Backend Processing:
1. Check if user already upvoted (prevent duplicate)
2. INSERT into post_upvotes table
3. Increment post's upvotes_count
4. Return success

Database Changes:
- New row in post_upvotes(user_id=2, post_id=1)
- posts.upvotes_count increases by 1 (150 → 151)
```

---

## Database Relationship Diagram

```
users
  │
  ├─→ posts (1:N) - One user creates many posts
  │     └─→ comments (1:N) - One post gets many comments
  │           └─→ post_upvotes (1:N) - One user can upvote many comments
  │     └─→ post_upvotes (1:N) - One user can upvote many posts
  │     └─→ bookmarks (1:N) - One user can bookmark many posts
  │
  ├─→ comments (1:N) - One user writes many comments
  │     ├─→ post_id (FK) - Belongs to a post
  │     ├─→ parent_comment_id (FK) - Nested replies
  │     └─→ comment_upvotes (1:N) - Comments can be upvoted
  │
  ├─→ post_upvotes (1:N) - One user upvotes many posts
  │
  ├─→ comment_upvotes (1:N) - One user upvotes many comments
  │
  └─→ bookmarks (1:N) - One user bookmarks many posts
```

---

## File Organization

### Backend Structure

```
Backend
├── API Layer (pages/api/)
│   ├── users.ts        - Request handling for user endpoints
│   ├── feed.ts         - Request handling for post endpoints
│   ├── comments.ts     - Request handling for comment endpoints
│   ├── upvote.ts       - Request handling for upvote endpoints
│   ├── bookmarks.ts    - Request handling for bookmark endpoints
│   ├── search.ts       - Request handling for search endpoint
│   └── health.ts       - Server health check
│
├── Data Layer (lib/)
│   └── db.ts           - Database connection pool
│
└── Schema (root)
    └── schema.sql      - Database table definitions
```

### Request Processing Flow

```
HTTP Request
   ↓
pages/api/[endpoint].ts
   ├─ Validate request
   ├─ Parse parameters
   ├─ Check authentication (optional)
   │
   ├─→ lib/db.ts
   │    └─ Execute SQL queries
   │
   └─ Format response
      ↓
HTTP Response (JSON)
```

---

## Query Examples

### Get Trending Posts

```typescript
// Frontend Request
GET /api/feed?sort=trending

// Backend Query
SELECT p.*, u.username, u.avatar_url
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.upvotes_count DESC, p.views_count DESC
LIMIT 50

// Response
[
  { id: 1, title: "Post", upvotes_count: 500, ... },
  { id: 2, title: "Post", upvotes_count: 450, ... },
]
```

### Search Posts

```typescript
// Frontend Request
GET /api/search?q=react&type=posts

// Backend Query
SELECT id, title, content, created_at
FROM posts
WHERE (title ILIKE '%react%' OR content ILIKE '%react%')
  AND status = 'published'
LIMIT 20

// Response
[
  { type: "post", id: 1, title: "Learning React", ... },
  { type: "post", id: 2, title: "React Hooks", ... },
]
```

### Get Comments with Author Info

```typescript
// Backend Query
SELECT c.*, u.username, u.avatar_url, u.full_name
FROM comments c
JOIN users u ON c.author_id = u.id
WHERE c.post_id = 1 AND c.status = 'published'
ORDER BY c.upvotes_count DESC, c.created_at DESC

// Response
[
  {
    id: 1,
    content: "Great post!",
    author_id: 2,
    username: "john_dev",
    avatar_url: "...",
    upvotes_count: 5,
    created_at: "..."
  }
]
```

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "title": "Example",
    "created_at": "2024-01-01T12:00:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Description of what went wrong",
  "message": "Optional helpful message"
}
```

### Error Status Codes

```
200 - OK (Success)
201 - Created (New resource)
400 - Bad Request (Invalid input)
404 - Not Found (Resource doesn't exist)
409 - Conflict (Duplicate key)
500 - Server Error (Internal error)
```

---

## Performance Optimization

### Indexes Created

```sql
✓ idx_posts_author_id      - Fast filtering by author
✓ idx_posts_category       - Fast filtering by category
✓ idx_posts_created_at     - Fast sorting by date
✓ idx_comments_post_id     - Fast fetching comments
✓ idx_comments_author_id   - Fast fetching user comments
✓ idx_post_upvotes_user_post - Prevent duplicate upvotes
✓ idx_bookmarks_user_id    - Fast fetching bookmarks
✓ idx_users_api_key        - Fast API key lookup
```

### Query Optimization Tips

1. **Always include LIMIT** - Prevent massive result sets
2. **Use indexes** - Query planner uses them automatically
3. **Join when needed** - Get related data in one query
4. **Paginate results** - Use OFFSET for large datasets
5. **Cache popular queries** - Redis (future optimization)

---

## Scalability Considerations

### Current Limitations

- Single PostgreSQL instance
- No caching layer
- No rate limiting
- All data in one database

### Future Improvements

```
Level 1: Caching
├─ Redis for hot data
├─ Cache popular posts
└─ Cache user profiles

Level 2: Database
├─ Read replicas
├─ Database sharding
└─ Archive old posts

Level 3: Infrastructure
├─ Load balancer
├─ Multiple app servers
├─ CDN for assets
└─ Search (Elasticsearch)

Level 4: Advanced
├─ Message queue (RabbitMQ)
├─ Microservices
├─ Event streaming (Kafka)
└─ Full-text search
```

---

## Development Workflow

```
1. Make code changes
   ↓
2. npm run dev (restarts server)
   ↓
3. Test with Postman or curl
   ↓
4. Check database with psql
   ↓
5. Fix errors
   ↓
6. Commit to git
   ↓
7. Deploy to production
```

---

## Monitoring & Debugging

### Check Database Connection

```bash
curl http://localhost:3000/api/db-test
curl http://localhost:3000/api/health
```

### View Server Logs

```bash
# Terminal show logs in real-time
tail -f server.log

# Search for errors
grep "error" server.log
```

### Database Queries

```bash
# Connect to database
psql -U tabnews_user -d tabnews

# List tables
\dt

# View schema
\d posts

# Run query
SELECT COUNT(*) FROM posts;
```

---

## Security Checklist (TODO)

- [ ] Add authentication (JWT/OAuth)
- [ ] Add authorization (role-based)
- [ ] Validate all inputs
- [ ] Rate limiting
- [ ] HTTPS/SSL
- [ ] SQL injection prevention (use parameterized queries ✓)
- [ ] CORS configuration
- [ ] API key encryption
- [ ] Data sanitization
- [ ] Audit logging

---

## Deployment Architecture

### For Vercel

```
GitHub Repository
      ↓
Vercel (auto deploy on push)
      ↓
Next.js App (serverless functions)
      ↓
PostgreSQL Database (external)
```

### For Self-hosted (Docker)

```
Docker Image
      ↓
Docker Container (running on server)
      ├─ Next.js app on port 3000
      └─ Connected to PostgreSQL
```

---

This architecture is designed to be:
- 📈 **Scalable** - Can grow with your users
- 🚀 **Fast** - Optimized queries and indexes
- 🔒 **Secure** - Parameterized queries, validation
- 📝 **Maintainable** - Clear code organization
- 🧪 **Testable** - Easy to test endpoints
