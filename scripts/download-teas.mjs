import { mkdir, writeFile } from "node:fs/promises";
import { TEA_SECTION } from "../public/tea-data.js";

const root = new URL("../public/assets/sir-george/", import.meta.url);
await mkdir(root, { recursive: true });
for (const item of TEA_SECTION.groups.flatMap(({ items }) => items)) {
  const response = await fetch(item.photoSource);
  if (!response.ok) throw new Error(`${item.name}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error(`Not a PNG: ${item.name}`);
  await writeFile(new URL(item.image.split("/").at(-1), root), bytes);
  console.log(`${item.name}: ${bytes.length} bytes`);
}
