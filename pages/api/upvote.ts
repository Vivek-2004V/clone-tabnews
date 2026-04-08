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
    const { post_id, user_id, comment_id } = req.body;

    if (req.method === "POST") {
      // Add upvote
      if (post_id && user_id) {
        // Check if already upvoted
        const existing = await query(
          "SELECT id FROM post_upvotes WHERE user_id = $1 AND post_id = $2",
          [user_id, post_id]
        );

        if (existing.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: "Already upvoted",
          });
        }

        await query(
          "INSERT INTO post_upvotes (user_id, post_id) VALUES ($1, $2)",
          [user_id, post_id]
        );

        // Update post upvotes count
        await query("UPDATE posts SET upvotes_count = upvotes_count + 1 WHERE id = $1", [post_id]);

        return res.status(201).json({
          success: true,
          message: "Post upvoted",
        });
      }

      // Upvote comment
      if (comment_id && user_id) {
        const existing = await query(
          "SELECT id FROM comment_upvotes WHERE user_id = $1 AND comment_id = $2",
          [user_id, comment_id]
        );

        if (existing.rows.length > 0) {
          return res.status(400).json({
            success: false,
            error: "Already upvoted",
          });
        }

        await query(
          "INSERT INTO comment_upvotes (user_id, comment_id) VALUES ($1, $2)",
          [user_id, comment_id]
        );

        // Update comment upvotes count
        await query("UPDATE comments SET upvotes_count = upvotes_count + 1 WHERE id = $1", [comment_id]);

        return res.status(201).json({
          success: true,
          message: "Comment upvoted",
        });
      }
    }

    if (req.method === "DELETE") {
      // Remove upvote
      if (post_id && user_id) {
        await query("DELETE FROM post_upvotes WHERE user_id = $1 AND post_id = $2", [user_id, post_id]);

        // Update post upvotes count
        await query("UPDATE posts SET upvotes_count = upvotes_count - 1 WHERE id = $1", [post_id]);

        return res.status(200).json({
          success: true,
          message: "Upvote removed",
        });
      }
    }

    res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("Upvotes API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
