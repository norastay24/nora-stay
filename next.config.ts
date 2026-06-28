import type { NextConfig } from "next";

function resolveSupabaseHostname() {
  const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  try {
    return new URL(configuredUrl).hostname;
  } catch {
    return null;
  }
}

const supabaseHostname = resolveSupabaseHostname();
const remotePatterns: NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]> = [];

if (supabaseHostname) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseHostname,
    pathname: "/storage/v1/object/public/**",
  });
}

remotePatterns.push({
  protocol: "https",
  hostname: "anookhotel.com",
  pathname: "/uploads/**",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
