import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = session?.user && ["SUPER_ADMIN", "ADMIN", "MANAGER", "EDITOR"].includes((session.user as any).role);
    
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split(".").pop() || "png";
    const filename = `${uuidv4()}.${ext}`;

    // Path to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Directory might already exist
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
