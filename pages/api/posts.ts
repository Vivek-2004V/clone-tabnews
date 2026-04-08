import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface PostInput {
  title: string;
  content: string;
}

// In-memory store for testing (replace with database when PostgreSQL is ready)
let posts: Post[] = [
  {
    id: 1,
    title: "Welcome to TabNews Clone",
    content: "This is a demo post. Connect PostgreSQL to use real database.",
    created_at: new Date().toISOString(),
  },
];

let dbConnected = false;

// Try to connect to database on startup (only once)
async function checkDatabase(): Promise<void> {
  if (dbConnected || !process.env.DATABASE_URL) return;

  try {
    await query("SELECT 1");
    dbConnected = true;
    console.log("✅ Database connected successfully");
  } catch (error) {
    // Silently fail - we have in-memory fallback
    dbConnected = false;
  }
}

checkDatabase();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | Post[] | { error: string }>
): Promise<void> {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      if (dbConnected) {
        const result = await query("SELECT * FROM posts ORDER BY created_at DESC");
        return res.status(200).json(result.rows);
      }
    } catch (error) {
      // Fallback silently
    }

    // Return in-memory posts
    return res.status(200).json(posts);
  }

  if (req.method === "POST") {
    const { title, content } = req.body as PostInput;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    try {
      if (dbConnected) {
        const result = await query(
          "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
          [title, content]
        );
        return res.status(201).json(result.rows[0]);
      }
    } catch (error) {
      // Fallback silently
    }

    // In-memory storage
    const newPost: Post = {
      id: Math.max(...posts.map((p) => p.id), 0) + 1,
      title,
      content,
      created_at: new Date().toISOString(),
    };
    posts.unshift(newPost);
    return res.status(201).json(newPost);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
