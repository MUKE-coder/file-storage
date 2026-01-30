# File Storage Registry Component

A complete file storage solution for Next.js applications with support for **AWS S3** and **Cloudflare R2**. Built as a [shadcn/ui](https://ui.shadcn.com/) registry component for easy installation and customization.

## Features

- **Multi-Provider Support**: Works with both AWS S3 and Cloudflare R2
- **Dropzone Component**: Beautiful drag-and-drop file uploads with 5 variants
- **Progress Tracking**: Real-time upload progress with XHR
- **File Management**: Track, list, and delete uploaded files
- **Presigned URLs**: Secure direct-to-storage uploads
- **Type Safe**: Full TypeScript support
- **Database Integration**: Prisma models for file metadata tracking

## Quick Install

```bash
pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json
```

## What Gets Installed

```
your-project/
├── components/
│   ├── ui/
│   │   ├── dropzone.tsx          # Main dropzone component (5 variants)
│   │   └── error-display.tsx     # Error display component
│   └── file-storage/
│       ├── categories/           # Category management components
│       │   ├── Categories.tsx
│       │   ├── CategoryForm.tsx
│       │   └── DeleteCategoryButton.tsx
│       └── files/                # File management components
│           ├── Files.tsx
│           └── DeleteFileButton.tsx
├── lib/
│   ├── s3Client.ts               # AWS S3 client configuration
│   ├── r2Client.ts               # Cloudflare R2 client configuration
│   ├── prisma.ts                 # Prisma client singleton
│   ├── fileDataExtractor.ts      # URL metadata extraction
│   ├── getNormalDate.ts          # Date formatting utility
│   └── api/
│       ├── categories/           # Category API functions
│       └── files/                # File API functions
├── app/api/
│   ├── s3/
│   │   ├── upload/route.ts       # S3 presigned URL generation
│   │   └── delete/route.ts       # S3 file deletion
│   ├── r2/
│   │   ├── upload/route.ts       # R2 presigned URL generation
│   │   └── delete/route.ts       # R2 file deletion
│   └── v1/
│       ├── categories/           # Category CRUD endpoints
│       └── files/                # File listing & stats endpoints
└── prisma/
    └── schema.prisma.example     # Prisma models to add
```

## Installation Guide

### Step 1: Install the Component

```bash
pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json
```

### Step 2: Install Dependencies

```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner uuid
pnpm add -D @types/uuid
```

### Step 3: Set Up Prisma (if not already configured)

If you don't have Prisma set up yet:

```bash
pnpm add -D prisma @prisma/client
pnpm dlx prisma init
```

### Step 4: Add Prisma Models

Open `prisma/schema.prisma.example` and copy the models to your existing `schema.prisma`:

```prisma
// Add these models to your existing schema.prisma file

model File {
  id        String          @id @default(cuid())
  name      String
  size      Int
  publicUrl String
  type      String
  key       String          @unique
  provider  StorageProvider @default(cloudflare)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
}

enum StorageProvider {
  aws
  cloudflare
}

// Optional: Category model for the demo
model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  image       String
  description String?
  isFeatured  Boolean  @default(false)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Then run:

```bash
pnpm dlx prisma generate
pnpm dlx prisma db push
```

### Step 5: Configure Environment Variables

Add these to your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# AWS S3 (if using S3)
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_S3_ACCESS_KEY_ID="your-access-key"
AWS_S3_SECRET_ACCESS_KEY="your-secret-key"

# Cloudflare R2 (if using R2)
CLOUDFLARE_R2_ACCESS_KEY_ID="your-r2-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-r2-secret-key"
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
CLOUDFLARE_R2_PUBLIC_DEV_URL="https://pub-xxx.r2.dev"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Usage

### Basic Dropzone

```tsx
import { Dropzone } from "@/components/ui/dropzone";

export default function MyComponent() {
  const handleUploadComplete = (url: string) => {
    console.log("File uploaded:", url);
  };

  return (
    <Dropzone
      provider="r2"  // or "s3"
      onUploadComplete={handleUploadComplete}
      maxSize={5 * 1024 * 1024}  // 5MB
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      }}
    />
  );
}
```

### Dropzone Variants

The dropzone comes with 5 built-in variants:

```tsx
// Default - Full featured with icon and description
<Dropzone variant="default" provider="r2" onUploadComplete={handleUpload} />

// Compact - Smaller with less padding
<Dropzone variant="compact" provider="r2" onUploadComplete={handleUpload} />

// Minimal - Just text, very compact
<Dropzone variant="minimal" provider="r2" onUploadComplete={handleUpload} />

// Avatar - Circular for profile pictures
<Dropzone variant="avatar" provider="r2" onUploadComplete={handleUpload} />

// Inline - Horizontal layout
<Dropzone variant="inline" provider="r2" onUploadComplete={handleUpload} />
```

### With Preview and Remove

```tsx
import { useState } from "react";
import { Dropzone } from "@/components/ui/dropzone";

export default function ImageUploader() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <Dropzone
      provider="r2"
      value={imageUrl}
      onUploadComplete={setImageUrl}
      onRemove={() => setImageUrl("")}
      showPreview
    />
  );
}
```

### With Form Integration (React Hook Form)

```tsx
import { useForm } from "react-hook-form";
import { Dropzone } from "@/components/ui/dropzone";

export default function ProductForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const imageUrl = form.watch("image");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Dropzone
        provider="r2"
        value={imageUrl}
        onUploadComplete={(url) => form.setValue("image", url)}
        onRemove={() => form.setValue("image", "")}
        showPreview
      />
      {/* other form fields */}
    </form>
  );
}
```

## API Routes

### Upload Presigned URL

**S3**: `POST /api/s3/upload`
**R2**: `POST /api/r2/upload`

Request:
```json
{
  "filename": "image.png",
  "contentType": "image/png"
}
```

Response:
```json
{
  "presignedUrl": "https://...",
  "publicUrl": "https://...",
  "key": "unique-file-key"
}
```

### Delete File

**S3**: `DELETE /api/s3/delete`
**R2**: `DELETE /api/r2/delete`

Request:
```json
{
  "key": "file-key-to-delete"
}
```

### List Files

`GET /api/v1/files`

Returns all tracked files with metadata.

### Storage Stats

`GET /api/v1/files/stats`

Returns storage statistics:
```json
{
  "totalFiles": 42,
  "totalSize": 157286400,
  "byProvider": {
    "cloudflare": { "count": 30, "size": 100000000 },
    "aws": { "count": 12, "size": 57286400 }
  }
}
```

## Storage Provider Setup

### AWS S3

1. Create an S3 bucket in AWS Console
2. Configure bucket for public access (or use CloudFront)
3. Create IAM credentials with S3 access
4. Add CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
    "ExposeHeaders": ["ETag"]
  }
]
```

### Cloudflare R2

1. Create an R2 bucket in Cloudflare Dashboard
2. Enable public access via R2.dev subdomain or custom domain
3. Generate API tokens with read/write permissions
4. Add CORS policy in bucket settings

## File Metadata Extraction

The component automatically tracks file metadata by encoding it in the URL:

```
https://storage.example.com/file.png?name=file.png&size=1024&type=image/png&key=abc123
```

This allows reconstruction of file metadata when saving to the database:

```typescript
import { extractFileDataFromUrl } from "@/lib/fileDataExtractor";

const fileData = extractFileDataFromUrl(imageUrl);
// { name: "file.png", size: 1024, type: "image/png", key: "abc123", publicUrl: "...", provider: "cloudflare" }
```

## Demo Pages

After installation, you can view the demo pages:

- `/categories` - Category management with image uploads
- `/files` - File storage tracking and statistics

## Dependencies

- `@aws-sdk/client-s3` - AWS S3 SDK
- `@aws-sdk/s3-request-presigner` - Presigned URL generation
- `@tanstack/react-query` - Data fetching and caching
- `react-dropzone` - Drag and drop file handling
- `react-hook-form` - Form management
- `zod` - Schema validation
- `uuid` - Unique ID generation
- `prisma` / `@prisma/client` - Database ORM

## TypeScript Support

All components and utilities are fully typed. Key types:

```typescript
interface DropzoneProps {
  provider: "s3" | "r2";
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  value?: string;
  showPreview?: boolean;
  variant?: "default" | "compact" | "minimal" | "avatar" | "inline";
  maxSize?: number;
  accept?: Accept;
  disabled?: boolean;
  className?: string;
}

interface FileData {
  name: string;
  size: number;
  publicUrl: string;
  type: string;
  key: string;
  provider: "aws" | "cloudflare";
}
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
