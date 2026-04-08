import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    const { user_id, post_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }

    if (req.method === "GET") {
      // Get user's bookmarks
      const result = await query(
        `SELECT p.*, u.username, u.avatar_url, u.full_name
         FROM bookmarks b
         JOIN posts p ON b.post_id = p.id
         JOIN users u ON p.author_id = u.id
         WHERE b.user_id = $1
         ORDER BY b.created_at DESC`,
        [user_id]
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    if (req.method === "POST") {
      if (!post_id) {
        return res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
      }

      // Check if already bookmarked
      const existing = await query(
        "SELECT id FROM bookmarks WHERE user_id = $1 AND post_id = $2",
        [user_id, post_id]
      );

      if (existing.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Already bookmarked",
        });
      }

      await query(
        "INSERT INTO bookmarks (user_id, post_id) VALUES ($1, $2)",
        [user_id, post_id]
      );

      return res.status(201).json({
        success: true,
        message: "Post bookmarked",
      });
    }

    if (req.method === "DELETE") {
      if (!post_id) {
        return res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
      }

      await query(
        "DELETE FROM bookmarks WHERE user_id = $1 AND post_id = $2",
        [user_id, post_id]
      );

      return res.status(200).json({
        success: true,
        message: "Bookmark removed",
      });
    }

    res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("Bookmarks API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
