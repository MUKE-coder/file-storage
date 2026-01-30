import { extractFileDataFromUrl } from "@/lib/fileDataExtractor";
import db from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;
  try {
    const existing = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          message: "Category Not found",
        },
        {
          status: 404,
        }
      );
    }

    // Extract file data if image exists
    let key: string | null = null;
    let provider: string | null = null;

    if (existing.image && existing.image.trim() !== "") {
      try {
        const fileData = extractFileDataFromUrl(existing.image);
        key = fileData.key;
        provider = fileData.provider;
      } catch (error) {
        console.log("Failed to extract file data:", error);
        // Continue with deletion even if file data extraction fails
      }
    }

    // Delete the image from the storage provider
    if (key && provider) {
      const endpoint = provider === "aws" ? "/api/s3/delete" : "/api/r2/delete";
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://file-storage.desishub.com"}${endpoint}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key }),
          }
        );

        if (!response.ok) {
          console.log("Failed to delete file from storage");
        }
      } catch (error) {
        console.log("Error deleting file from storage:", error);
        // Continue with category deletion even if file deletion fails
      }
    }

    // Delete the file record from database (if it exists)
    if (key) {
      try {
        await db.file.deleteMany({
          where: {
            key,
          },
        });
      } catch (error) {
        console.log("Failed to delete file record:", error);
      }
    }

    // Delete the category
    await db.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        message: "Category deleted successfully",
      },
      {
        status: 200,
      }
    );
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
