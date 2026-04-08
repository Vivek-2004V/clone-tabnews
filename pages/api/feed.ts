import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  category?: string;
  tags?: string;
  views_count: number;
  upvotes_count: number;
  comments_count: number;
  created_at: string;
}

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
    if (req.method === "GET") {
      const { id, category, search, sort = "latest" } = req.query;

      // Get single post
      if (id) {
        const result = await query(
          `SELECT p.*, u.username, u.full_name, u.avatar_url 
           FROM posts p 
           JOIN users u ON p.author_id = u.id 
           WHERE p.id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: "Post not found",
          });
        }

        // Increment views
        await query("UPDATE posts SET views_count = views_count + 1 WHERE id = $1", [id]);

        return res.status(200).json({
          success: true,
          data: result.rows[0],
        });
      }

      // Get posts with filters
      let sql = `SELECT p.*, u.username, u.full_name, u.avatar_url 
                 FROM posts p 
                 JOIN users u ON p.author_id = u.id 
                 WHERE p.status = 'published'`;
      const params: any[] = [];

      if (category) {
        sql += " AND p.category = $" + (params.length + 1);
        params.push(category);
      }

      if (search) {
        sql += " AND (p.title ILIKE $" + (params.length + 1) + " OR p.content ILIKE $" + (params.length + 1) + ")";
        params.push("%" + search + "%");
      }

      if (sort === "trending") {
        sql += " ORDER BY p.upvotes_count DESC, p.views_count DESC";
      } else if (sort === "popular") {
        sql += " ORDER BY p.comments_count DESC";
      } else {
        sql += " ORDER BY p.created_at DESC";
      }

      sql += " LIMIT 50";

      const result = await query(sql, params);

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    if (req.method === "POST") {
      const { title, content, author_id, category, tags } = req.body;

      if (!title || !content || !author_id) {
        return res.status(400).json({
          success: false,
          error: "Title, content, and author_id are required",
        });
      }

      const result = await query(
        `INSERT INTO posts (title, content, author_id, category, tags) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [title, content, author_id, category || null, tags || null]
      );

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: result.rows[0],
      });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { title, content, category, tags } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
      }

      const result = await query(
        `UPDATE posts 
         SET title = COALESCE($1, title), 
             content = COALESCE($2, content),
             category = COALESCE($3, category),
             tags = COALESCE($4, tags),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [title || null, content || null, category || null, tags || null, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Post not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",
        data: result.rows[0],
      });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "Post ID is required",
        });
      }

      await query("DELETE FROM posts WHERE id = $1", [id]);

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });
    }

    res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("Posts API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
