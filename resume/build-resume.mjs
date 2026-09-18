// Renders resume/resume.html to assets/resume.pdf with headless Chrome.
// Usage:  node resume/build-resume.mjs
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const input = pathToFileURL(resolve(here, "resume.html")).href;
const output = resolve(here, "..", "assets", "resume.pdf");

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error("Chrome/Edge not found. Set CHROME_PATH to your browser executable.");
  process.exit(1);
}

const result = spawnSync(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--virtual-time-budget=8000", // let web fonts load before printing
    `--print-to-pdf=${output}`,
    input,
  ],
  { stdio: "ignore", timeout: 60000 }
);

if (result.status !== 0 || !existsSync(output)) {
  console.error("PDF generation failed.");
  process.exit(1);
}
console.log(`Wrote ${output} (${(statSync(output).size / 1024).toFixed(1)} KB)`);
