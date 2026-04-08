import { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/db";

interface DbTestResponse {
  status: string;
  message?: string;
  error?: string;
  code?: string;
  hint?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DbTestResponse>
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    console.log("🔍 Testing database connection...");
    console.log("📍 DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");

    const result = await query("SELECT NOW()");

    res.status(200).json({
      status: "✅ Connected",
      message: "Database connection successful",
    });
  } catch (error: any) {
    console.error("❌ Connection Test Error:", {
      message: error.message,
      code: error.code,
    });

    res.status(500).json({
      status: "❌ Failed",
      error: error.message,
      code: error.code,
      hint: "PostgreSQL might not be running. Check DATABASE_URL in .env.local",
    });
  }
}
