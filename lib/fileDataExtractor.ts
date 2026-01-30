type Provider = "aws" | "cloudflare";

interface FileData {
  name: string;
  size: number;
  publicUrl: string;
  type: string;
  key: string;
  provider: Provider;
}

export function extractFileDataFromUrl(imageUrl: string): FileData {
  // Parse the URL
  const url = new URL(imageUrl);

  // Extract the base URL (everything before the query string)
  const publicUrl = url.origin + url.pathname;

  // Extract query parameters
  const params = url.searchParams;
  const provider = (params.get("p") || "") as Provider;
  return {
    name: params.get("name") || "",
    size: parseInt(params.get("size") || "0", 10),
    publicUrl: publicUrl,
    type: params.get("type") || "",
    key: params.get("key") || "",
    provider: provider,
  };
}
