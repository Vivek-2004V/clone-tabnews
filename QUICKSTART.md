# 🚀 Quick Start Guide

## Prerequisites

✅ Node.js v16+ installed
✅ PostgreSQL v12+ installed and running
✅ npm or yarn

---

## Step 1: Setup Database

### 1.1 Create Database & User

```bash
psql -U postgres
```

```sql
CREATE DATABASE tabnews;
CREATE USER user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE tabnews TO user;
\q
```

### 1.2 Create Table

```bash
psql -U user -d tabnews < init.sql
```

Verify table creation:
```bash
psql -U user -d tabnews -c "SELECT * FROM posts;"
```

---

## Step 2: Configure Environment

Update `.env.local`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/tabnews
```

---

## Step 3: Install Dependencies

```bash
npm install
```

---

## Step 4: Run Development Server

```bash
npm run dev
```

Output should show:
```
> next dev

▲ Next.js 16.2.2
- Local:        http://localhost:3000
```

---

## Step 5: Access Application

**Homepage (View Posts)**
```
http://localhost:3000
```

**API Endpoint (Test)**
```
http://localhost:3000/api/posts
```

---

## Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Homepage - displays all posts |
| `/api/posts` | GET | Get all posts (JSON) |
| `/api/posts` | POST | Create new post |

---

## Test the API

### Create a Post (using curl)

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is amazing!"
  }'
```

### Get All Posts

```bash
curl http://localhost:3000/api/posts
```

---

## Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
clone-tabnews/
├── pages/
│   ├── index.js              # Homepage
│   └── api/
│       └── posts.js          # API endpoint
├── components/
│   ├── PostCard.js           # Post card component
│   └── CreatePost.js         # Create post form
├── lib/
│   └── db.js                 # Database connection
├── styles/
├── .env.local                # Environment variables
├── init.sql                  # Database schema
├── package.json
└── README.md
```

---

## Troubleshooting

Having issues? Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common problems and solutions.

---

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint:check   # Check code formatting
npm run lint:fix     # Fix code formatting
```

---

## 🎯 Next Steps

- [ ] Setup database
- [ ] Install dependencies
- [ ] Configure .env.local
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test creating a post
- [ ] Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues occur
