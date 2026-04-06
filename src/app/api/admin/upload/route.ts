import { NextResponse } from "next/server";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return false;
  }
  return true;
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const folder = process.env.CLOUDINARY_FOLDER || "lunor-atelier";

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret, folder };
};

const uploadToCloudinary = async (file: File) => {
  const config = getCloudinaryConfig();
  if (!config) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `folder=${config.folder}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = crypto
    .createHash("sha1")
    .update(signaturePayload)
    .digest("hex");

  const cloudinaryForm = new FormData();
  cloudinaryForm.append("file", file);
  cloudinaryForm.append("api_key", config.apiKey);
  cloudinaryForm.append("timestamp", timestamp);
  cloudinaryForm.append("folder", config.folder);
  cloudinaryForm.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/auto/upload`,
    {
      method: "POST",
      body: cloudinaryForm,
    }
  );

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(`Cloud upload failed: ${reason}`);
  }

  const payload = (await response.json()) as { secure_url?: string; url?: string };
  const url = payload.secure_url || payload.url;
  if (!url) {
    throw new Error("Cloud upload did not return a URL");
  }

  return url;
};

export async function POST(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { message: "Only image or video files are allowed" },
      { status: 400 }
    );
  }

  try {
    const cloudUrl = await uploadToCloudinary(file);
    if (cloudUrl) {
      return NextResponse.json({ url: cloudUrl, provider: "cloudinary" });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cloudinary upload failed";
    return NextResponse.json({ message }, { status: 502 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".png";
  const safeBase = file.name
    .replace(ext, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .slice(0, 40);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}-${safeBase}${ext}`;

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, provider: "local" });
}
