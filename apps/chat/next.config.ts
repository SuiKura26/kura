import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Load environment variables from shared env/ folder manually
const isProd = process.env.NODE_ENV === "production";
const envPath = path.resolve(process.cwd(), `../../env/.env.${isProd ? "production" : "local"}`);

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const firstEqual = trimmed.indexOf("=");
      if (firstEqual !== -1) {
        const key = trimmed.slice(0, firstEqual).trim();
        const value = trimmed.slice(firstEqual + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
