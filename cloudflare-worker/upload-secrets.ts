// upload-secrets.ts
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

interface EnvVars {
  [key: string]: string;
}

const ENV_FILE = ".dev.vars.production";
const ENVIRONMENT = "production";

function loadEnvVars(): EnvVars {
  const envPath = path.resolve(process.cwd(), ENV_FILE);

  if (!fs.existsSync(envPath)) {
    console.error(`❌ File not found: ${ENV_FILE}`);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const envVars: EnvVars = {};

  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const [key, ...valueParts] = trimmed.split("=");
    if (key && valueParts.length) {
      const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
      envVars[key.trim()] = value;
    }
  });

  return envVars;
}

async function uploadSecrets() {
  console.log(`📤 Uploading secrets from ${ENV_FILE} to ${ENVIRONMENT} environment...\n`);

  const envVars = loadEnvVars();
  const secrets = Object.entries(envVars);

  if (secrets.length === 0) {
    console.error("❌ No secrets found in file");
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const [key, value] of secrets) {
    console.log(`Uploading ${key}...`);
    try {
      // NOTE: execSync.shell must be a *string* for type safety
      const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";

      execSync(`echo "${value}" | pnpm wrangler secret put ${key} --env ${ENVIRONMENT}`, {
        stdio: "inherit",
        shell, // ✅ fix TS2769: string, not boolean
      });

      console.log(`✅ ${key} uploaded successfully`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to upload ${key}`);
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}`);
      }
      failCount++;
    }
  }

  console.log(`\n📊 Summary: ${successCount} succeeded, ${failCount} failed`);

  if (failCount > 0) {
    process.exit(1);
  }
}

uploadSecrets().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
