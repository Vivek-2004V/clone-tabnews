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
    const { post_id } = req.query;

    if (!post_id) {
      return res.status(400).json({
        success: false,
        error: "Post ID is required",
      });
    }

    if (req.method === "GET") {
      // Get comments for a post
      const result = await query(
        `SELECT c.*, u.username, u.avatar_url, u.full_name
         FROM comments c
         JOIN users u ON c.author_id = u.id
         WHERE c.post_id = $1 AND c.status = 'published'
         ORDER BY c.upvotes_count DESC, c.created_at DESC`,
        [post_id]
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    if (req.method === "POST") {
      const { content, author_id, parent_comment_id } = req.body;

      if (!content || !author_id) {
        return res.status(400).json({
          success: false,
          error: "Content and author_id are required",
        });
      }

      const result = await query(
        `INSERT INTO comments (content, author_id, post_id, parent_comment_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [content, author_id, post_id, parent_comment_id || null]
      );

      // Update post comment count
      await query("UPDATE posts SET comments_count = comments_count + 1 WHERE id = $1", [post_id]);

      return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: result.rows[0],
      });
    }

    if (req.method === "DELETE") {
      const { comment_id } = req.body;

      if (!comment_id) {
        return res.status(400).json({
          success: false,
          error: "Comment ID is required",
        });
      }

      await query("DELETE FROM comments WHERE id = $1", [comment_id]);

      // Update post comment count
      await query("UPDATE posts SET comments_count = comments_count - 1 WHERE id = $1", [post_id]);

      return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    }

    res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("Comments API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
