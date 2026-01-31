"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Cloud,
  Database,
  FileUp,
  Layers,
  Rocket,
  ExternalLink,
  ChevronRight,
  Youtube,
  Linkedin,
  Globe,
} from "lucide-react";
import Link from "next/link";

function CodeBlock({
  code,
  language = "bash",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
          {step}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <div className="space-y-4 text-slate-600">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl text-slate-900">
              File Storage
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://www.youtube.com/@JBWEBDEVELOPER"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muke-johnbaptist-95bb82198/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://jb.desishub.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
                title="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
            <Link
              href="/categories"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Demo <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-6">
          <Rocket className="w-4 h-4" />
          shadcn Registry Component
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
          File Storage System
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          A complete file storage solution with AWS S3 and Cloudflare R2
          support. Includes dropzone component, file tracking, and example
          pages.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <Cloud className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-slate-700">Cloudflare R2</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <Cloud className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-slate-700">AWS S3</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <Database className="w-5 h-5 text-indigo-500" />
            <span className="font-semibold text-slate-700">Prisma 7</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
            <FileUp className="w-5 h-5 text-emerald-500" />
            <span className="font-semibold text-slate-700">Dropzone</span>
          </div>
        </div>
      </section>

      {/* Quick Install */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Quick Install</h2>
          <p className="text-indigo-100 mb-6">
            Install the file-storage component using the shadcn CLI:
          </p>
          <CodeBlock
            code={`pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json`}
          />
          {/* <p className="text-indigo-200 text-sm mt-4">
            Replace <code className="bg-indigo-500/50 px-2 py-0.5 rounded">your-domain.com</code> with the URL where this registry is hosted.
          </p> */}
        </div>
      </section>

      {/* What's Included */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          What&apos;s Included
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <FileUp className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Dropzone Component
            </h3>
            <p className="text-slate-600">
              Multi-variant dropzone with progress tracking, preview, and
              automatic upload to S3/R2.
            </p>
          </div>
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <Cloud className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Storage Clients
            </h3>
            <p className="text-slate-600">
              Pre-configured clients for AWS S3 and Cloudflare R2 with presigned
              URL generation.
            </p>
          </div>
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <Layers className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              API Routes
            </h3>
            <p className="text-slate-600">
              Ready-to-use API endpoints for file upload, delete, and tracking
              with file metadata storage.
            </p>
          </div>
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <Database className="w-10 h-10 text-indigo-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              2 Example Pages
            </h3>
            <p className="text-slate-600">
              <strong>/categories</strong> - List categories with image uploads.{" "}
              <strong>/file-storage</strong> - Track files, storage space &
              provider.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Installation Guide
        </h2>
        <div className="space-y-6">
          <StepCard step={1} title="Install the Component">
            <p>
              Run the following command to install the file-storage component:
            </p>
            <CodeBlock
              code={`pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json`}
            />
            <p className="text-sm text-slate-500">
              This will install all required files and dependencies.
            </p>
          </StepCard>

          <StepCard step={2} title="Set Up Prisma (if not already configured)">
            <p>
              If you don&apos;t have Prisma set up yet, install the required
              packages:
            </p>
            <CodeBlock
              code={`pnpm add @prisma/client @prisma/adapter-pg dotenv pg
pnpm add -D prisma tsx @types/pg`}
            />
            <p>Initialize Prisma:</p>
            <CodeBlock code={`pnpm dlx prisma init`} />
            <p>
              Create a{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded">
                prisma.config.ts
              </code>{" "}
              file:
            </p>
            <CodeBlock
              language="typescript"
              code={`import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
})`}
            />
          </StepCard>

          <StepCard step={3} title="Add Prisma Models">
            <p>
              Add the following models to your existing{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded">
                prisma/schema.prisma
              </code>{" "}
              file:
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 font-semibold">
                Important: Don&apos;t replace your entire schema!
              </p>
              <p className="text-amber-700 text-sm mt-1">
                Only add the models below to your existing schema file.
              </p>
            </div>
            <CodeBlock
              language="prisma"
              code={`// Required: File model for tracking uploads
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

// Optional: Example Category model with file upload
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
}`}
            />
          </StepCard>

          <StepCard step={4} title="Configure Environment Variables">
            <p>
              Add these environment variables to your{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded">.env</code>{" "}
              file:
            </p>
            <CodeBlock
              code={`# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# AWS S3 Configuration (if using S3)
AWS_S3_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
AWS_S3_ACCESS_KEY_ID=""
AWS_S3_SECRET_ACCESS_KEY=""

# Cloudflare R2 Configuration (if using R2)
CLOUDFLARE_R2_ACCESS_KEY_ID=""
CLOUDFLARE_R2_SECRET_ACCESS_KEY=""
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
CLOUDFLARE_R2_PUBLIC_DEV_URL="https://pub-xxx.r2.dev"`}
            />
          </StepCard>

          <StepCard step={5} title="Generate Prisma Client & Push Schema">
            <p>
              Generate the Prisma client and push your schema to the database:
            </p>
            <CodeBlock
              code={`pnpm dlx prisma generate
pnpm dlx prisma db push`}
            />
          </StepCard>

          <StepCard step={6} title="Add Postinstall Script (for deployment)">
            <p>
              Add this to your{" "}
              <code className="bg-slate-100 px-2 py-0.5 rounded">
                package.json
              </code>{" "}
              for Vercel/production deployments:
            </p>
            <CodeBlock
              language="json"
              code={`{
  "scripts": {
    "postinstall": "prisma generate"
  }
}`}
            />
          </StepCard>
        </div>
      </section>

      {/* Usage */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8">Usage</h2>
        <div className="space-y-6">
          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Using the Dropzone Component
            </h3>
            <CodeBlock
              language="tsx"
              code={`import { Dropzone, FileWithMetadata } from "@/components/ui/dropzone";
import { useState } from "react";

export function MyComponent() {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);

  return (
    <Dropzone
      provider="cloudflare" // or "aws"
      variant="default"     // "default" | "compact" | "minimal" | "avatar" | "inline"
      maxFiles={5}
      maxSize={1024 * 1024 * 10} // 10MB
      onFilesChange={setFiles}
      accept={{
        "image/*": [],
        "application/pdf": [],
      }}
    />
  );
}`}
            />
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 bg-white">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Dropzone Variants
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["default", "compact", "minimal", "avatar", "inline"].map(
                (variant) => (
                  <div
                    key={variant}
                    className="text-center p-3 bg-slate-50 rounded-xl"
                  >
                    <code className="text-sm text-indigo-600 font-mono">
                      {variant}
                    </code>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* File Structure */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Installed Files
        </h2>
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-sm overflow-x-auto">
          <pre>{`your-project/
├── app/
│   ├── (example)/
│   │   ├── categories/           # /categories - List categories with image upload
│   │   │   └── page.tsx
│   │   └── file-storage/         # /file-storage - Track files & storage stats
│   │       └── page.tsx
│   └── api/
│       ├── s3/
│       │   ├── upload/route.ts   # S3 presigned URL generation
│       │   └── delete/route.ts   # S3 file deletion
│       ├── r2/
│       │   ├── upload/route.ts   # R2 presigned URL generation
│       │   └── delete/route.ts   # R2 file deletion
│       └── v1/
│           ├── categories/       # Category CRUD endpoints
│           └── files/            # File listing & stats endpoints
├── components/
│   ├── ui/
│   │   ├── dropzone.tsx          # Main dropzone component (5 variants)
│   │   └── error-display.tsx     # Error display component
│   └── file-storage/
│       ├── categories/           # Category management components
│       └── files/                # File listing components
├── lib/
│   ├── s3Client.ts               # AWS S3 client
│   ├── r2Client.ts               # Cloudflare R2 client
│   ├── prisma.ts                 # Prisma client singleton
│   ├── fileDataExtractor.ts      # URL metadata extractor
│   ├── getNormalDate.ts          # Date formatter
│   └── api/
│       ├── categories/           # Category API helpers
│       └── files/                # File API helpers
└── prisma/
    └── schema.prisma.example     # Prisma models to add`}</pre>
        </div>
      </section>

      {/* Example Pages Section */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Example Pages Included
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/categories"
            className="group border border-slate-200 rounded-2xl p-6 bg-white hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <code className="text-lg font-bold text-indigo-600">
                /categories
              </code>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Categories Page
            </h3>
            <ul className="text-slate-600 space-y-1 text-sm">
              <li>• List all categories with images</li>
              <li>• Create new categories with image upload</li>
              <li>• Edit and delete categories</li>
              <li>• Pagination support</li>
            </ul>
          </Link>

          <Link
            href="/file-storage"
            className="group border border-slate-200 rounded-2xl p-6 bg-white hover:border-indigo-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-3 rounded-xl group-hover:bg-indigo-200 transition-colors">
                <Cloud className="w-6 h-6 text-indigo-600" />
              </div>
              <code className="text-lg font-bold text-indigo-600">
                /file-storage
              </code>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              File Storage Page
            </h3>
            <ul className="text-slate-600 space-y-1 text-sm">
              <li>• Track all uploaded files</li>
              <li>• View total storage space used</li>
              <li>• See provider breakdown (S3 vs R2)</li>
              <li>• Delete files with confirmation</li>
            </ul>
          </Link>
        </div>
      </section>

      {/* Demo Link */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-slate-900 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            See it in Action
          </h2>
          <p className="text-slate-300 mb-6">
            Check out the example pages to see the components working together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/categories"
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              <Layers className="w-5 h-5" />
              /categories
            </Link>
            <Link
              href="/file-storage"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Cloud className="w-5 h-5" />
              /file-storage
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-slate-500 text-sm">
                File Storage Registry Component
              </p>
              <p className="text-slate-400 text-xs">
                Built by{" "}
                <a
                  href="https://jb.desishub.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  JB Web Developer
                </a>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.youtube.com/@JBWEBDEVELOPER"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/muke-johnbaptist-95bb82198/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://jb.desishub.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://ui.shadcn.com/docs/registry"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                shadcn Registry Docs
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://www.prisma.io/docs/guides/nextjs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Prisma 7 Guide
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
