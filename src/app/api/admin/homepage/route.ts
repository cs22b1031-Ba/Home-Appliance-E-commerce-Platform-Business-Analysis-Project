import { NextResponse } from "next/server";
import {
  readHomepageContent,
  writeHomepageContent,
  type HomepageContent,
} from "@/lib/homepage-content";

const assertAdmin = (request: Request) => {
  const token = request.headers.get("x-admin-token");
  return Boolean(process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
};

export async function GET(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const content = await readHomepageContent();
  return NextResponse.json(content);
}

export async function PATCH(request: Request) {
  if (!assertAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as Partial<HomepageContent>;
  const updated = await writeHomepageContent(payload);
  return NextResponse.json(updated);
}
