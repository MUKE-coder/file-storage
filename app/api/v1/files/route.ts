import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const files = await db.file.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(files, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
