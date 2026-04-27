import { test, describe } from "node:test";
import assert from "node:assert/strict";
// @ts-expect-error Mixbox does not supply types.
import mixbox from "mixbox";

import MixSharedSecret, { validateOtherPublicColor } from "../app/cryptcolors/mix-shared-secret.ts";
import { colorChoices, unmix } from "../app/cryptcolors/constants.ts";
import { BASE_COLOR } from "../app/cryptcolors/mixing-config.ts";

const toHex = (arr: number[]) =>
    arr.slice(0, 3).map((v) => v.toString(16).padStart(2, "0")).join("");
const publicFor = (privateHex: string): string => toHex(mixbox.lerp(privateHex, BASE_COLOR, 0.5));

describe("validateOtherPublicColor", () => {
    test("empty input returns prompt", () => {
        assert.equal(validateOtherPublicColor("")?.kind, "prompt");
    });
    test("whitespace-only returns prompt", () => {
        assert.equal(validateOtherPublicColor("   ")?.kind, "prompt");
    });
    test("non-hex characters return error", () => {
        assert.equal(validateOtherPublicColor("zzzzzz")?.kind, "error");
    });
    test("short input returns progress", () => {
        assert.equal(validateOtherPublicColor("123")?.kind, "progress");
    });
    test("too-long input returns error", () => {
        assert.equal(validateOtherPublicColor("abcdef0")?.kind, "error");
    });
    test("unrecognized 6-hex returns error", () => {
        assert.equal(validateOtherPublicColor("ffffff")?.kind, "error");
    });
    test("known unmix entry validates", () => {
        assert.equal(validateOtherPublicColor(unmix[0]), null);
    });
    test("# prefix is accepted", () => {
        assert.equal(validateOtherPublicColor(`#${unmix[0]}`), null);
    });
    test("uppercase is normalized", () => {
        assert.equal(validateOtherPublicColor(unmix[0].toUpperCase()), null);
    });
});

describe("MixSharedSecret", () => {
    test("commutative: Alice and Bob arrive at same secret regardless of order", () => {
        // Sample several pair fractions spread across the palette
        const N = colorChoices.length;
        const pickIdx = (frac: number) => Math.min(N - 1, Math.floor(N * frac));
        const pairs = [[0, 1], [0, 0.5], [0.1, 0.75], [0.25, 0.99], [0.4, 0.6], [0.99, 0.1]]
            .map(([a, b]) => [pickIdx(a), pickIdx(b)]);
        for (const [i, j] of pairs) {
            const privA = colorChoices[i];
            const privB = colorChoices[j];
            const pubA = publicFor(privA);
            const pubB = publicFor(privB);

            const secretA = MixSharedSecret(BASE_COLOR, privA, pubB, colorChoices);
            const secretB = MixSharedSecret(BASE_COLOR, privB, pubA, colorChoices);

            assert.equal(
                secretA,
                secretB,
                `pair (${i}, ${j}): Alice got ${secretA}, Bob got ${secretB}`
            );
            assert.match(secretA, /^#[0-9a-f]{6}$/, `secret should be a hex color`);
        }
    });

    test("returns empty string for unrecognized public color", () => {
        const result = MixSharedSecret(BASE_COLOR, colorChoices[0], "ffffff", colorChoices);
        assert.equal(result, "");
    });

    test("unmix table entries actually match generated publics", () => {
        // Spot-check that the constants table is internally consistent
        const N = colorChoices.length;
        const indices = [0, 1, Math.floor(N / 4), Math.floor(N / 2), Math.floor(3 * N / 4), N - 1];
        for (const i of indices) {
            assert.equal(
                publicFor(colorChoices[i]),
                unmix[i],
                `unmix[${i}] should match mix(base, colorChoices[${i}], 0.5)`
            );
        }
    });

    test("all pairwise secrets are unique across the palette", () => {
        const seen = new Map();
        for (let i = 0; i < colorChoices.length; i++) {
            const pubI = publicFor(colorChoices[i]);
            for (let j = i + 1; j < colorChoices.length; j++) {
                const secret = MixSharedSecret(
                    BASE_COLOR,
                    colorChoices[j],
                    pubI,
                    colorChoices
                );
                const prev = seen.get(secret);
                if (prev !== undefined) {
                    assert.fail(
                        `secret ${secret} collides: pairs (${prev[0]},${prev[1]}) and (${i},${j})`
                    );
                }
                seen.set(secret, [i, j]);
            }
        }
    });
});
