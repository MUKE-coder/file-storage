import { CategoryCreateData } from "@/lib/api/categories/schema";
import { extractFileDataFromUrl } from "@/lib/fileDataExtractor";
import db from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const result = categories.map((c) => {
      return {
        ...c,
        productsCount: 0,
      };
    });
    return NextResponse.json(result, {
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

export async function POST(request: NextRequest) {
  try {
    const body: CategoryCreateData = await request.json();
    const { name, description, image, isFeatured, isActive } = body;

    // Validate that image exists
    if (!image || image.trim() === "") {
      return NextResponse.json(
        {
          message: "Image URL is required",
        },
        {
          status: 400,
        }
      );
    }

    const slug = name.toLowerCase().trim().split(" ").join("-");
    const existingCategory = await db.category.findFirst({
      where: {
        slug,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          message: "Category Already exists",
        },
        {
          status: 409,
        }
      );
    }

    const fileData = extractFileDataFromUrl(image);

    // Create both in a transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      await tx.file.create({
        data: fileData,
      });

      await tx.category.create({
        data: {
          slug,
          name,
          description,
          image,
          isFeatured,
          isActive,
        },
      });
    });

    return NextResponse.json(
      {
        message: "Category Created successfully",
      },
      {
        status: 201,
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
