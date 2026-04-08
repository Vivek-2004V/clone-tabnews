import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";
import crypto from "crypto";

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  api_key: string;
  created_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

// Generate API key
function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
): Promise<void> {
  try {
    if (req.method === "POST") {
      const { username, email, full_name } = req.body;

      if (!username || !email) {
        return res.status(400).json({
          success: false,
          error: "Username and email are required",
        });
      }

      const apiKey = generateApiKey();
      const result = await query(
        `INSERT INTO users (username, email, full_name, api_key) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, username, email, full_name, api_key, created_at`,
        [username, email, full_name || null, apiKey]
      );

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result.rows[0],
      });
    }

    if (req.method === "GET") {
      const { id } = req.query;

      if (id) {
        const result = await query(
          `SELECT id, username, email, full_name, bio, avatar_url, created_at 
           FROM users WHERE id = $1`,
          [id]
        );

        if (result.rows.length === 0) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        return res.status(200).json({
          success: true,
          data: result.rows[0],
        });
      }

      // Get all users
      const result = await query(
        `SELECT id, username, email, full_name, bio, avatar_url, created_at 
         FROM users LIMIT 50`
      );

      return res.status(200).json({
        success: true,
        data: result.rows,
      });
    }

    res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (error: any) {
    console.error("User API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
}
