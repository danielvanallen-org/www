// @ts-expect-error Mixbox does not supply types.
import { default as mixbox } from "mixbox";
import { unmix } from "./constants";
import { colord } from "colord";

export default function MixSharedSecret(baseColor: string, privateColor: string, otherPublicColor: string, colorChoices: string[]) {

    /* We cheat and look up the original private color for the corresponding otherPublicColor
        because our color mixer is not actually commutative. */

    const ci = unmix.indexOf(otherPublicColor);
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
