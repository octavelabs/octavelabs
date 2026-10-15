import { cp, rm, mkdir, readFile, stat, readdir } from "node:fs/promises";
const source = new URL("../src/", import.meta.url), target = new URL("../dist/", import.meta.url);
for (const entry of await readdir(source, { recursive: true })) {
  if (!entry.endsWith('.html')) continue;
  const page = new URL(entry, source);
  const html = await readFile(page, 'utf8');
  if (/www\.figma\.com\/api\/mcp\/asset/.test(html)) throw Error(`Temporary Figma asset URL remains in ${entry}.`);
  for (const [, asset] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|\/|data:)/.test(asset)) continue;
    const clean = asset.split('#')[0].split('?')[0];
    if (!(await stat(new URL(clean, page))).size) throw Error(`Empty local reference in ${entry}: ${asset}`);
  }
}
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(source, target, { recursive: true });
console.log("Built dist/ and verified all pages’ local references.");
