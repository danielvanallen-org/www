// @ts-expect-error Mixbox does not supply types.
import { default as mixbox } from "mixbox";
import { unmix } from "./constants";
import { colord } from "colord";

export type ValidationResult = { kind: "prompt" | "progress" | "error"; message: string } | null;

export function validateOtherPublicColor(otherPublicColor: string): ValidationResult {
    const normalized = otherPublicColor.trim().toLowerCase().replace(/^#/, "");
    if (normalized === "") {
        return { kind: "prompt", message: "Enter your partner's public color above to see the shared secret." };
    }
    if (!/^[0-9a-f]*$/.test(normalized)) {
        return { kind: "error", message: "Public colors only use the digits 0-9 and the letters a-f." };
    }
    if (normalized.length < 6) {
        return { kind: "progress", message: `Keep going! Public colors are 6 characters long. You've entered ${normalized.length}.` };
    }
    if (normalized.length > 6) {
        return { kind: "error", message: `Public colors are only 6 characters long. You've entered ${normalized.length}.` };
    }
    if (!unmix.includes(normalized)) {
        return { kind: "error", message: "That isn't one of the public colors that can be made from the picker. Double-check the code with your partner." };
    }
    return null;
}

export default function MixSharedSecret(baseColor: string, privateColor: string, otherPublicColor: string, colorChoices: string[]) {

    /* We cheat and look up the original private color for the corresponding otherPublicColor
        because our color mixer is not actually commutative. */

    const ci = unmix.indexOf(otherPublicColor.trim().toLowerCase().replace(/^#/, ""));
    if (ci === -1) {
        return "";
    }
    const otherPrivateColor = colorChoices[ci];

    const z1 = mixbox.rgbToLatent(baseColor);
    const z2 = mixbox.rgbToLatent(privateColor);
    const z3 = mixbox.rgbToLatent(otherPrivateColor);

    const zMix = new Array(mixbox.LATENT_SIZE);

    for (let i = 0; i < zMix.length; i++) { // mix:
        zMix[i] = (
            0.34 * z1[i] +                  // 34% of rgb1
            0.33 * z2[i] +                  // 33% of rgb2
            0.33 * z3[i]                    // 33% of rgb3
        );
    }

    return colord(mixbox.latentToRgb(zMix).toString()).toHex();
}
