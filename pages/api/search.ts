import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface SearchResult {
  type: "post" | "user" | "comment";
  id: number;
  title?: string;
  username?: string;
  content?: string;
  author_id?: number;
  post_id?: number;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: SearchResult[];
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { q, type = "all" } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        error: "Search query is required",
      });
    }

    const searchTerm = "%" + q + "%";
    let results: SearchResult[] = [];

    // Search posts
    if (type === "all" || type === "posts") {
      const postsResult = await query(
        `SELECT id, title, content, created_at 
         FROM posts 
         WHERE (title ILIKE $1 OR content ILIKE $1) AND status = 'published'
         LIMIT 20`,
        [searchTerm]
      );

      results = [
        ...results,
        ...postsResult.rows.map((row: any) => ({
          type: "post" as const,
          ...row,
        })),
      ];
    }

    // Search users
    if (type === "all" || type === "users") {
      const usersResult = await query(
        `SELECT id, username, bio, created_at 
         FROM users 
         WHERE username ILIKE $1 OR full_name ILIKE $1
         LIMIT 20`,
        [searchTerm]
      );

      results = [
        ...results,
        ...usersResult.rows.map((row: any) => ({
          type: "user" as const,
          ...row,
        })),
      ];
    }

    // Search comments
    if (type === "all" || type === "comments") {
      const commentsResult = await query(
        `SELECT id, content, author_id, post_id, created_at 
         FROM comments 
         WHERE content ILIKE $1 AND status = 'published'
         LIMIT 20`,
        [searchTerm]
      );

      results = [
        ...results,
        ...commentsResult.rows.map((row: any) => ({
          type: "comment" as const,
          ...row,
        })),
      ];
    }

    return res.status(200).json({
      success: true,
      data: results.slice(0, 50),
    });
  } catch (error: any) {
    console.error("Search API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
