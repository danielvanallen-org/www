// @ts-expect-error Mixbox does not supply types.
import mixbox from "mixbox";
import { writeFileSync } from "fs";
import { BASE_COLOR, W_BASE, W_LOW, W_HIGH } from "../app/cryptcolors/mixing-config.ts";

const baseColor = BASE_COLOR;
const STEP = 4;
const OUT_PATH = "app/cryptcolors/constants.ts";

type Latent = number[];
type Candidate = { priv: string; pub: string; latent: Latent };
type CuratedCandidate = Candidate & { lab: Lab };
type BandedCandidate = CuratedCandidate & { h: number; l: number; s: number };
type Lab = { L: number; a: number; b: number };

const toHex = (r: number, g: number, b: number): string =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
const baseLatent: Latent = mixbox.rgbToLatent(baseColor);
const LATENT_SIZE: number = mixbox.LATENT_SIZE;

const candidates: Candidate[] = [];
const seenPub = new Set<string>();
for (let r = 0; r < 256; r += STEP)
  for (let g = 0; g < 256; g += STEP)
    for (let b = 0; b < 256; b += STEP) {
      const priv = toHex(r, g, b);
      const pubArr = mixbox.lerp(priv, baseColor, 0.5);
      const pub = toHex(pubArr[0], pubArr[1], pubArr[2]);
      if (!seenPub.has(pub)) {
        seenPub.add(pub);
        candidates.push({ priv, pub, latent: mixbox.rgbToLatent(priv) });
      }
    }

const selected: Candidate[] = [];
const selectedSecrets = new Set<string>();
const z = new Array(LATENT_SIZE);
for (const cand of candidates) {
  let ok = true;
  const newSecrets: string[] = [];
  for (const prev of selected) {
    const [latLow, latHigh] = cand.priv < prev.priv
      ? [cand.latent, prev.latent]
      : [prev.latent, cand.latent];
    for (let i = 0; i < LATENT_SIZE; i++)
      z[i] = W_BASE * baseLatent[i] + W_LOW * latLow[i] + W_HIGH * latHigh[i];
    const rgb = mixbox.latentToRgb(z);
    const secret = toHex(rgb[0], rgb[1], rgb[2]);
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

const rgbFromHex = (h: string): [number, number, number] => {
  const s = h.replace(/^#/, "");
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};
const hsl = (hex: string): { h: number; s: number; l: number } => {
  const [r, g, b] = rgbFromHex(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h, s, l };
};

const srgbToLinear = (c: number): number => (c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92);
const oklab = (hex: string): Lab => {
  const [R, G, B] = rgbFromHex(hex).map((v) => srgbToLinear(v / 255));
  const l = 0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B;
  const m = 0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B;
  const s = 0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  };
};
const deltaE = (c1: Lab, c2: Lab): number => {
  const dL = c1.L - c2.L, da = c1.a - c2.a, db = c1.b - c2.b;
  return Math.sqrt(dL * dL + da * da + db * db);
};

// Curate: drop near-black / near-white / desaturated, then drop any color too
// close (in OKLab) to one already kept. The remaining set is still
// cryptographically valid because any subset of `selected` keeps the
// unique-publics and unique-pairwise-secrets properties.
const L_MIN = 0.20;
const L_MAX = 0.92;
const S_MIN = 0.35; // drop muted/grayish colors before binning
const MIN_DELTA_E = 0.04;
const curated: CuratedCandidate[] = [];
for (const c of selected) {
  const lab = oklab(c.priv);
  if (lab.L < L_MIN || lab.L > L_MAX) continue;
  if (hsl(c.priv).s < S_MIN) continue;
  let tooClose = false;
  for (const k of curated) {
    if (deltaE(lab, k.lab) < MIN_DELTA_E) { tooClose = true; break; }
  }
  if (!tooClose) curated.push({ ...c, lab });
}
console.log(`Curated ${selected.length} -> ${curated.length} (L in [${L_MIN},${L_MAX}], S>=${S_MIN}, minΔE=${MIN_DELTA_E})`);

// Cap per-hue-band count so the picker grid wraps into even rows. Within each
// band, keep the entries with the most evenly-spaced lightness values.
const HUE_BANDS = 9;
const PER_BAND = 9; // matches the picker grid columns
const grouped = new Map<number, BandedCandidate[]>();
for (const c of curated) {
  const A = hsl(c.priv);
  const band = A.s < 0.05 ? -1 : Math.floor(A.h * HUE_BANDS);
  if (!grouped.has(band)) grouped.set(band, []);
  grouped.get(band)!.push({ ...c, h: A.h, l: A.l, s: A.s });
}
const final: BandedCandidate[] = [];
const bands = [...grouped.keys()].sort((a, b) => a - b);
for (const bi of bands) {
  if (bi === -1) continue;
  const band = grouped.get(bi)!.sort((a, b) => a.l - b.l);
  if (band.length <= PER_BAND) {
    final.push(...band);
  } else {
    // Pick PER_BAND entries with evenly-spaced lightness
    const picks: BandedCandidate[] = [];
    for (let i = 0; i < PER_BAND; i++) {
      const idx = Math.round((i * (band.length - 1)) / (PER_BAND - 1));
      picks.push(band[idx]);
    }
    final.push(...picks);
  }
}
// Greys excluded from the strict NxN layout
console.log(`Capped to ${HUE_BANDS} bands × ≤${PER_BAND} = ${final.length} colors`);

const strip = (h: string): string => h.replace(/^#/, "");
const fmt = (arr: string[]): string => arr.map((x) => `    "${strip(x)}"`).join(",\n");
const out =
  `\nconst colorChoices = [\n${fmt(final.map((s) => s.priv))}\n];\n\n` +
  `/* Result of mixing colorChoices above with the base color.\n` +
  `   Used to unmix the otherPublicColor when mixing the sharedSecretColor. */\n` +
  `const unmix = [\n${fmt(final.map((s) => s.pub))}\n];\n\n` +
  `export { colorChoices, unmix };\n`;

writeFileSync(OUT_PATH, out);
console.log(`Wrote ${final.length} entries to ${OUT_PATH}`);
