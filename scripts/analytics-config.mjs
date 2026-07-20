import fs from "node:fs";
import path from "node:path";

const command = process.argv[2] || "check";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const result = {};
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const separator = line.indexOf("=");
    const name = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^(['"])(.*)\1$/, "$2");
    result[name] = value;
  }
  return result;
}

function analyticsEnv() {
  const mode =
    process.env.NODE_ENV === "development" ? "development" : "production";
  return {
    ...parseEnvFile(".env"),
    ...parseEnvFile(".env.local"),
    ...parseEnvFile(`.env.${mode}`),
    ...parseEnvFile(`.env.${mode}.local`),
    ...process.env,
  };
}

function inspectConfig(env) {
  const enabled = env.VITE_ANALYTICS_ENABLED === "true";
  const googleId = String(env.VITE_GA_MEASUREMENT_ID || "").trim();
  const metricaId = String(env.VITE_YANDEX_METRICA_ID || "").trim();
  const consentMode = String(env.VITE_ANALYTICS_CONSENT_MODE || "required");
  const errors = [];
  if (enabled && !googleId && !metricaId)
    errors.push("No analytics counter is configured.");
  if (googleId && !/^G-[A-Z0-9]+$/i.test(googleId)) {
    errors.push("VITE_GA_MEASUREMENT_ID must look like G-XXXXXXXXXX.");
  }
  if (metricaId && !/^[1-9]\d*$/.test(metricaId)) {
    errors.push(
      "VITE_YANDEX_METRICA_ID must be a positive numeric counter ID.",
    );
  }
  if (!["required", "implicit"].includes(consentMode)) {
    errors.push("VITE_ANALYTICS_CONSENT_MODE must be required or implicit.");
  }
  return { enabled, googleId, metricaId, consentMode, errors };
}

function inspectRuntime(config) {
  const runtimePath = "src/analytics/analytics.ts";
  if (!config.enabled || !config.googleId || !fs.existsSync(runtimePath)) {
    return [];
  }
  const source = fs.readFileSync(runtimePath, "utf8");
  return source.includes("window.dataLayer?.push(arguments)")
    ? []
    : [
        "Google Tag queue must push the native arguments object; arrays are not executed by gtag.js.",
      ];
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const config = inspectConfig(analyticsEnv());
config.errors.push(...inspectRuntime(config));
if (config.errors.length) {
  for (const error of config.errors) console.error(`ERROR: ${error}`);
  process.exit(1);
}

if (command === "check") {
  console.log(
    `Analytics config OK: enabled=${config.enabled}, ga=${Boolean(config.googleId)}, ` +
      `metrica=${Boolean(config.metricaId)}, consent=${config.consentMode}`,
  );
  process.exit(0);
}

if (command !== "verify-dist") {
  console.error(`Unknown command: ${command}`);
  process.exit(2);
}

if (!fs.existsSync("dist")) {
  console.error("ERROR: dist does not exist. Run npm run build first.");
  process.exit(1);
}
const javascript = walk("dist")
  .filter((file) => file.endsWith(".js"))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
const missing = [];
if (!javascript.includes("ODA_ANALYTICS_RUNTIME_V1"))
  missing.push("runtime marker");
if (config.enabled && config.googleId && !javascript.includes(config.googleId))
  missing.push("GA ID");
if (
  config.enabled &&
  config.metricaId &&
  !javascript.includes(config.metricaId)
) {
  missing.push("Metrica ID");
}
if (missing.length) {
  console.error(`ERROR: built bundle is missing ${missing.join(", ")}.`);
  process.exit(1);
}
console.log(`Analytics bundle OK: marker found, enabled=${config.enabled}.`);
