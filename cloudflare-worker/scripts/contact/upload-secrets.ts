// scripts/upload-secrets.ts
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

interface EnvVars {
  [key: string]: string;
}

const ENV_FILE = ".dev.vars.production";
const ENVIRONMENT = "production";

const REQUIRED_SECRETS = [
  "BREVO_API_KEY",
  "TURNSTILE_SECRET_KEY", 
  "SENDER_EMAIL",
  "RECEIVER_EMAIL",
];

const OPTIONAL_SECRETS = ["BACKDOOR_CONTACT_KEY"];

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

function validateSecrets(envVars: EnvVars): void {
  const missing = REQUIRED_SECRETS.filter(key => !envVars[key]);
  
  if (missing.length > 0) {
    console.error("❌ Missing required secrets:");
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }

  console.log("✅ All required secrets present");
  
  OPTIONAL_SECRETS.forEach(key => {
    if (envVars[key]) {
      console.log(`📌 Optional secret ${key} is configured`);
    }
  });
}

async function uploadSecrets() {
  console.log(`📤 Uploading secrets to ${ENVIRONMENT} environment...\n`);

  const envVars = loadEnvVars();
  validateSecrets(envVars);
  
  const secrets = Object.entries(envVars);
  let successCount = 0;
  let failCount = 0;

  for (const [key, value] of secrets) {
    console.log(`Uploading ${key}...`);
    try {
      const shell = process.platform === "win32" ? "cmd.exe" : "/bin/sh";
      const maskedValue = key.includes("KEY") || key.includes("SECRET") 
        ? `${value.substring(0, 4)}...` 
        : value;
      
      console.log(`   Value: ${maskedValue}`);

      // Use process.stdin to avoid shell escaping issues
      execSync(`pnpm wrangler secret put ${key} --env ${ENVIRONMENT}`, {
        input: value,
        stdio: ["pipe", "inherit", "inherit"],
        shell,
      });

      console.log(`✅ ${key} uploaded`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to upload ${key}`);
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