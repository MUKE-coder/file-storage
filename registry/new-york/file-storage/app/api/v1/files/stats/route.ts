import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all files
    const files = await db.file.findMany();

    // Calculate total size
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    // Get files from this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const filesThisMonth = await db.file.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    // Set max storage (e.g., 1GB = 1073741824 bytes)
    const maxStorage = 1073741824; // 1GB
    const usedPercentage = (totalSize / maxStorage) * 100;

    const stats = {
      totalFiles: files.length,
      totalSize,
      usedPercentage,
      maxStorage,
      filesThisMonth,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
