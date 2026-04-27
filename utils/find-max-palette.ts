// Find the max-size set of private colors such that:
//   1. Each maps to a unique public color (mix(base, private, 0.5) -> hex)
//   2. Each pair produces a unique shared secret using sorted asymmetric weights
//
// Run: node utils/find-max-palette.ts [step] [w_low] [w_high] [base]
//   defaults pulled from app/cryptcolors/mixing-config.ts

// @ts-expect-error Mixbox does not supply types.
import mixbox from "mixbox";
import { BASE_COLOR, W_LOW as DEFAULT_W_LOW, W_HIGH as DEFAULT_W_HIGH } from "../app/cryptcolors/mixing-config.ts";

const baseColor = process.argv[5] ?? BASE_COLOR;
const STEP = Number(process.argv[2] ?? 8);
const W_LOW = Number(process.argv[3] ?? DEFAULT_W_LOW);
const W_HIGH = Number(process.argv[4] ?? DEFAULT_W_HIGH);
const W_BASE = 1 - W_LOW - W_HIGH;

if (W_BASE <= 0) {
  console.error("w_low + w_high must be < 1");
  process.exit(1);
}

console.log(`STEP=${STEP}  base=${baseColor}  weights: base=${W_BASE.toFixed(3)}, low=${W_LOW}, high=${W_HIGH}`);

type Latent = number[];
type Candidate = { priv: string; pub: string; latent: Latent };

const toHex = (r: number, g: number, b: number): string =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

const baseLatent: Latent = mixbox.rgbToLatent(baseColor);
const LATENT_SIZE: number = mixbox.LATENT_SIZE;

// Step 1: scan candidates, dedupe by public color
console.log(`\nScanning candidates...`);
const t0 = Date.now();
const candidates: Candidate[] = [];
const seenPub = new Set<string>();
for (let r = 0; r < 256; r += STEP) {
  for (let g = 0; g < 256; g += STEP) {
    for (let b = 0; b < 256; b += STEP) {
      const priv = toHex(r, g, b);
      const pubArr = mixbox.lerp(priv, baseColor, 0.5);
      const pub = toHex(pubArr[0], pubArr[1], pubArr[2]);
      if (!seenPub.has(pub)) {
        seenPub.add(pub);
        candidates.push({ priv, pub, latent: mixbox.rgbToLatent(priv) });
      }
    }
  }
}
console.log(`  ${candidates.length.toLocaleString()} candidates with unique publics in ${(Date.now() - t0) / 1000}s`);

// Step 2: greedy select for pairwise secret uniqueness
console.log(`\nGreedy-selecting for pairwise secret uniqueness...`);
const t1 = Date.now();
const selected: Candidate[] = [];
const selectedSecrets = new Set<string>();
const z = new Array(LATENT_SIZE);

let progress = 0;
let lastReport = Date.now();

const computeSecret = (latA: Latent, latB: Latent): string => {
  for (let i = 0; i < LATENT_SIZE; i++) {
    z[i] = W_BASE * baseLatent[i] + W_LOW * latA[i] + W_HIGH * latB[i];
  }
  const rgb = mixbox.latentToRgb(z);
  return toHex(rgb[0], rgb[1], rgb[2]);
};

for (const cand of candidates) {
  progress++;
  if (Date.now() - lastReport > 5000) {
    console.log(`  scanned ${progress.toLocaleString()}/${candidates.length.toLocaleString()}, selected=${selected.length}`);
    lastReport = Date.now();
  }

  // Both sides will sort by hex string, so for cand vs prev: the "low" is
  // whichever has the smaller hex string.
  let ok = true;
  const newSecrets: string[] = [];
  for (const prev of selected) {
    const [low, high] = cand.priv < prev.priv ? [cand.latent, prev.latent] : [prev.latent, cand.latent];
    const secret = computeSecret(low, high);
    if (selectedSecrets.has(secret) || newSecrets.includes(secret)) {
      ok = false;
      break;
    }
    newSecrets.push(secret);
  }
  if (ok) {
    selected.push(cand);
    for (const s of newSecrets) selectedSecrets.add(s);
  }
}
console.log(`  done in ${((Date.now() - t1) / 1000).toFixed(1)}s`);

console.log(`\n=== RESULT ===`);
console.log(`Maximum palette size: ${selected.length.toLocaleString()}`);
console.log(`(out of ${candidates.length.toLocaleString()} candidates with unique publics)`);
console.log(`\nFirst 15 entries:`);
for (let i = 0; i < Math.min(15, selected.length); i++) {
  console.log(`  ${i.toString().padStart(3)}. private=${selected[i].priv}  public=${selected[i].pub}`);
}
