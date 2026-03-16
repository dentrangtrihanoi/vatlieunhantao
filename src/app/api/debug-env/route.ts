import { NextResponse } from "next/server";

// Simple debug endpoint — remove after diagnosing production issues
// Access: /api/debug-env
export async function GET() {
  return NextResponse.json({
    cloudinary: {
      CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? "✅ SET" : "❌ MISSING",
      API_KEY: process.env.CLOUDINARY_API_KEY ? "✅ SET" : "❌ MISSING",
      API_SECRET: process.env.CLOUDINARY_API_SECRET ? "✅ SET" : "❌ MISSING",
    },
    database: {
      DATABASE_URL: process.env.DATABASE_URL ? "✅ SET" : "❌ MISSING",
    },
    node_env: process.env.NODE_ENV,
  });
}
