import { NextApiRequest, NextApiResponse } from "next";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface ApiResponse<T> {
  status?: string;
  data?: T;
  error?: string;
  message?: string;
}

export default function health(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ server_time: string }>>
): void {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    data: { server_time: new Date().toISOString() },
  });
}
