# 🚨 Troubleshooting Guide

## ❌ 1. Database Connection Error

### Problem
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

### ✅ Solutions

**Check 1: PostgreSQL is running**
```bash
# For Linux/Mac
pg_isready

# Output should be:
# accepting connections
```

**Check 2: .env.local file exists**
```bash
ls -la .env.local
```

**Check 3: DATABASE_URL is correct**
```bash
cat .env.local
# Should show: DATABASE_URL=postgresql://user:password@localhost:5432/tabnews
```

**Check 4: Database exists**
```bash
psql -U user -d postgres -c "SELECT datname FROM pg_database WHERE datname='tabnews';"
```

**Check 5: Verify credentials**
```bash
psql -U user -d tabnews
# If it connects, your credentials are correct
```

---

## ❌ 2. API Returns 500 Error

### Problem
```
POST /api/posts → 500 Internal Server Error
```

### ✅ Solutions

**Check 1: Enable error logging**

Update `pages/api/posts.js`:
```javascript
catch (error) {
  console.error('Database Error:', error);
  res.status(500).json({ error: error.message });
}
```

**Check 2: Table exists**
```bash
psql -U user -d tabnews -c "SELECT * FROM posts;"
```

If table doesn't exist, create it:
```bash
psql -U user -d tabnews < init.sql
```

**Check 3: Column names match**

Ensure your SQL query uses correct column names:
- `title` (not `post_title`)
- `content` (not `body`)
- `created_at` (not `createdAt`)

**Check 4: Check PostgreSQL logs**
```bash
# On Linux
tail -f /var/log/postgresql/postgresql-*.log
```

---

## ❌ 3. Fetch Data Returns Empty Array

### Problem
```
Posts fetch but array is empty: []
```

### ✅ Solutions

**Check 1: Browser Console**
- Open DevTools (F12)
- Go to Console tab
- Check for errors

**Check 2: Test API directly**

Open in browser:
```
http://localhost:3000/api/posts
```

Should return JSON array:
```json
[
  {
    "id": 1,
    "title": "Test Post",
    "content": "Test content",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

**Check 3: Insert test data**
```bash
psql -U user -d tabnews
```

```sql
INSERT INTO posts (title, content) VALUES ('Test Post', 'This is a test');
SELECT * FROM posts;
```

**Check 4: Check Network tab**
- Press F12 → Network tab
- Refresh page
- Click on `/api/posts` request
- Check Response tab for actual data

---

## ❌ 4. CORS Error (If Using Separate Backend)

### Problem
```
Access to XMLHttpRequest blocked by CORS policy
```

### ✅ Solutions

**Update `pages/api/posts.js`:**

```javascript
export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ... rest of your code
}
```

---

## ❌ 5. Port 3000 Already in Use

### Problem
```
Error: Port 3000 is already in use
```

### ✅ Solutions

**Kill process using port 3000:**
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

Or use different port:
```bash
npm run dev -- -p 3001
```

---

## ❌ 6. "Cannot find module" Error

### Problem
```
Error: Cannot find module 'pg'
```

### ✅ Solutions

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Or just install pg
npm install pg
```

---

## ✅ Quick Debug Checklist

- [ ] PostgreSQL is running: `pg_isready`
- [ ] .env.local exists with correct DATABASE_URL
- [ ] Database `tabnews` exists
- [ ] Table `posts` exists
- [ ] Node modules installed: `npm install`
- [ ] No errors in browser console (F12)
- [ ] API endpoint returns data: `http://localhost:3000/api/posts`
- [ ] Server is running: `npm run dev`

---

## 📞 Need More Help?

Check the logs:
```bash
# Terminal 1: Run server with verbose output
npm run dev

# Terminal 2: Check PostgreSQL connection
psql -U user -d tabnews -c "SELECT version();"
```

Monitor database queries:
```sql
-- In psql
SELECT * FROM pg_stat_statements ORDER BY query_start DESC LIMIT 5;
```
