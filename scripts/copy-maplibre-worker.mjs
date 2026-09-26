/**
 * Copies MapLibre's Web Worker into `public/maplibre/` so it can be served
 * from our own origin.
 *
 * Why this is needed: maplibre-gl resolves its worker as
 * `new URL('./maplibre-gl-worker.mjs', import.meta.url)`. That assumes the
 * worker sits next to the main bundle, which is not true once Turbopack has
 * bundled the app — the request 404s and the map fails with "Worker failed to
 * load. Check that the worker URL is correct." Because the path is built by
 * string concatenation, no bundler can statically resolve and emit it either.
 *
 * So we self-host it and point `setWorkerUrl()` at the copy (see
 * components/common/TerritoryMap.tsx).
 *
 * `maplibre-gl-worker.mjs` imports `./maplibre-gl-shared.mjs`, so both files
 * must be copied and must stay siblings.
 *
 * Wired to `postinstall` and `prebuild` so the copies can't drift out of sync
 * with the installed maplibre-gl version.
 */
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "maplibre-gl", "dist");
const to = join(root, "public", "maplibre");

const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

const { version } = JSON.parse(
  readFileSync(join(root, "node_modules", "maplibre-gl", "package.json"), "utf8"),
);

mkdirSync(to, { recursive: true });
for (const file of FILES) {
  copyFileSync(join(from, file), join(to, file));
}
console.log(`[maplibre] copied worker (v${version}) to public/maplibre/`);
