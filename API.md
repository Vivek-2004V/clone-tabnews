# API Documentation - Developer Community Platform

## Base URL
```
http://localhost:3003
```

## Authentication
Include your API key in the header (when implemented):
```
Authorization: Bearer YOUR_API_KEY
```

---

## 👤 Users API

### Create User (Get API Key)
```bash
POST /api/users
Content-Type: application/json

{
  "username": "john_dev",
  "email": "john@example.com",
  "full_name": "John Developer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "username": "john_dev",
    "email": "john@example.com",
    "full_name": "John Developer",
    "api_key": "xyz123...",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Get User Profile
```bash
GET /api/users?id=1
```

### List All Users
```bash
GET /api/users
```

---

## 📰 Posts/Feed API

### Create Post
```bash
POST /api/feed
Content-Type: application/json

{
  "title": "How to Build Web Apps",
  "content": "Complete guide to web development...",
  "author_id": 1,
  "category": "web-development",
  "tags": "javascript, react, typescript"
}
```

### Get All Posts
```bash
GET /api/feed
```

**Query Parameters:**
- `category` - Filter by category (e.g., `?category=web-development`)
- `search` - Search in title/content (e.g., `?search=react`)
- `sort` - `latest`, `trending`, or `popular`

**Example:**
```bash
GET /api/feed?category=web-development&sort=trending
```

### Get Single Post
```bash
GET /api/feed?id=1
```

### Update Post
```bash
PUT /api/feed?id=1
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "web-development",
  "tags": "javascript, react"
}
```

### Delete Post
```bash
DELETE /api/feed?id=1
```

---

## 💬 Comments API

### Get Comments for a Post
```bash
GET /api/comments?post_id=1
```

### Add Comment
```bash
POST /api/comments?post_id=1
Content-Type: application/json

{
  "content": "Great article! Here's my thoughts...",
  "author_id": 2,
  "parent_comment_id": null
}
```

**Note:** Set `parent_comment_id` to reply to a comment (nested comments)

### Delete Comment
```bash
DELETE /api/comments?post_id=1
Content-Type: application/json

{
  "comment_id": 5
}
```

---

## 👍 Upvotes API

### Upvote a Post
```bash
POST /api/upvote
Content-Type: application/json

{
  "post_id": 1,
  "user_id": 2
}
```

### Upvote a Comment
```bash
POST /api/upvote
Content-Type: application/json

{
  "comment_id": 5,
  "user_id": 2
}
```

### Remove Upvote
```bash
DELETE /api/upvote
Content-Type: application/json

{
  "post_id": 1,
  "user_id": 2
}
```

---

## 🔖 Bookmarks API

### Get User's Bookmarks
```bash
GET /api/bookmarks?user_id=1
```

### Bookmark a Post
```bash
POST /api/bookmarks?user_id=1&post_id=5
```

### Remove Bookmark
```bash
DELETE /api/bookmarks?user_id=1&post_id=5
```

---

## 🔍 Search API

### Search Everything
```bash
GET /api/search?q=react
```

### Search by Type
```bash
GET /api/search?q=typescript&type=posts
GET /api/search?q=john&type=users
GET /api/search?q=database&type=comments
```

---

## 📊 Database Schema

### Users
- `id` - User ID
- `username` - Unique username
- `email` - Unique email
- `full_name` - Display name
- `bio` - User bio
- `avatar_url` - Profile picture URL
- `api_key` - API authentication key
- `created_at` - Creation timestamp

### Posts
- `id` - Post ID
- `title` - Post title
- `content` - Post body/content
- `author_id` - Creator's user ID
- `category` - Post category/topic
- `tags` - Comma-separated tags
- `views_count` - View counter
- `upvotes_count` - Total upvotes
- `comments_count` - Total comments
- `created_at` - Creation timestamp

### Comments
- `id` - Comment ID
- `content` - Comment text
- `author_id` - Creator's user ID
- `post_id` - Parent post ID
- `parent_comment_id` - Reply to comment ID (for nested replies)
- `upvotes_count` - Total upvotes
- `created_at` - Creation timestamp

---

## 🚀 Quick Start

### 1. Setup Database
```bash
psql -U user -d tabnews < schema.sql
```

### 2. Create a User
```bash
curl -X POST http://localhost:3003/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dev_user",
    "email": "dev@example.com",
    "full_name": "Dev User"
  }'
```

### 3. Create a Post
```bash
curl -X POST http://localhost:3003/api/feed \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post!",
    "author_id": 1,
    "category": "general",
    "tags": "first, post"
  }'
```

### 4. Fetch Posts
```bash
curl http://localhost:3003/api/feed
```

### 5. Comment on a Post
```bash
curl -X POST http://localhost:3003/api/comments?post_id=1 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great post!",
    "author_id": 2
  }'
```

### 6. Upvote a Post
```bash
curl -X POST http://localhost:3003/api/upvote \
  -H "Content-Type: application/json" \
  -d '{
    "post_id": 1,
    "user_id": 2
  }'
```

---

## 📝 Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 🔒 Rate Limiting
Not implemented yet. Contributing welcome!

## 📚 More Features Coming
- Authentication & authorization
- User profiles & followers
- Notifications
- Admin moderation tools
- Analytics dashboard
