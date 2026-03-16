import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// One-time endpoint to push DB schema — access: /api/run-db-push?secret=your_secret
// Remove this file after successfully running migration
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // Simple auth: must pass the secret from env
  const expectedSecret = process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss", {
      cwd: process.cwd(),
      timeout: 60000,
    });

    return NextResponse.json({
      success: true,
      stdout: stdout.slice(0, 2000),
      stderr: stderr.slice(0, 500),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stdout: error.stdout?.slice(0, 2000),
      stderr: error.stderr?.slice(0, 500),
    });
  }
}
