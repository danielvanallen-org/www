"use client";

import CryptColorPicker from "./color-picker";
import { useState } from "react";
// @ts-expect-error Mixbox does not supply types.
import { default as mixbox } from "mixbox";
import { colord } from "colord";
import ColorSwatch from "./color-swatch";
import MixSharedSecret, { validateOtherPublicColor } from "./mix-shared-secret";
import { colorChoices } from "./constants";


export default function Home() {

  const baseColor = "#2190bc";
  const [privateColor, setPrivateColor] = useState<string>(colorChoices[0]);
  const publicColor = colord(mixbox.lerp(privateColor, baseColor, 0.5).toString()).toHex()
  const [otherPublicColor, setOtherPublicColor] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [fireworkKey, setFireworkKey] = useState<number>(0);

  const copyPublicColor = async () => {
    await navigator.clipboard.writeText(publicColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const validationError = validateOtherPublicColor(otherPublicColor);
  const sharedSecretColor = MixSharedSecret(baseColor, privateColor, otherPublicColor, colorChoices);

  return (
    <main>
      <h1 className="text-center mb-3">Crypt Colors</h1>
      <p className="text-center mb-10">
        Try public key cryptography by mixing paint to share a secret color!
      </p>

      <p>
        When you load a web page, the address in your URL bar usually starts with &quot;https&quot; instead of &quot;http&quot;.  The &quot;s&quot; stands for &quot;secure&quot;, which means the website has identified itself with a certificate, which includes a public key.
      </p>
      <p>
        Public key cryptography uses a math function that can send secret messages while talking out in the open where someone else has access to all of your messages.  The function works by using a pair of related keys: a private key and a public key which is based off the private key.  The public key can be shared with anyone, but the private key must be kept secret.
      </p>
      <p>
        There are two important ways that mixing paint and the math function for finding a shared secret are alike:
      </p>
      <ol className="list-decimal">
        <li>When you mix colors of paint you are performing a <em>one-way operation</em>.</li>
        <li>When you mix colors of paint it doesn't matter what <em>order</em> you mix them in.</li>
      </ol>
      <p>
        We can see how public key cryptography works for ourselves using colors of paint.
      </p>
      <ol className="list-decimal">
        <li>
          First, you will choose any private color you want, which you will not share.
        </li>
        <li>
          Then, you will mix your private color with the provided base color to create a public color, which you will share.
        </li>
        <li>
          Finally, you will mix your private color from step (1) with the other person&apos;s public color from step (2) to create a new shared secret color.
        </li>
      </ol>

      <p>
        First, choose your private color and note the six-digit code below the color picker.
      </p>
      <p>
        Don&apos;t share this code with anyone else!
      </p>
      <CryptColorPicker color={privateColor} setColor={setPrivateColor} colorChoices={colorChoices} />
      <p>
        Now we will mix your private color with the base color to create your public color.
      </p>
      <p>
        You can share the base color and your public color.
      </p>

      <div className="mb-6">
        <ColorSwatch color={baseColor} />
        <div className="text-center">Mixing with Base Color: {baseColor}</div>
      </div>
      <div className="mb-6">
        <div onClick={copyPublicColor} className="cursor-pointer" title="Click to copy">
          <ColorSwatch color={publicColor} />
        </div>
        <div className="text-center text-3xl mt-2">
          <strong>Your Public Color: {publicColor}</strong>
          <button onClick={copyPublicColor} aria-label="Copy public color" title="Click to copy" className="ml-2 cursor-pointer align-top">
            <ClipboardIcon />
          </button>
          {copied && <span className="ml-2 text-green-600 animate-fade-in">Copied!</span>}
        </div>
      </div>

      <p>
        Finally, we will mix the other person&apos;s public color with your private color to create a shared secret color.
      </p>
      <p>
        Each of the two partners will end up with the same shared secret color!
      </p>

      <p>
        Ask your partner for the six-digit code representing their public color, and type it here:
      </p>
      <div className="bg-white mb-6 flex w-fit mx-auto text-4xl font-mono rounded-md">
        <span className="pl-4 py-3 select-none text-gray-900">
          <span className="relative inline-block">
            #
            {fireworkKey > 0 && <FireworkBurst key={fireworkKey} />}
          </span>
        </span>
        <input
          type="text"
          value={otherPublicColor}
          placeholder="14d347"
          size={7}
          maxLength={7}
          onInput={(e) => {
            const v = e.currentTarget.value;
            if (v.startsWith("#")) {
              setFireworkKey((n) => n + 1);
            }
            setOtherPublicColor(v.replace(/^#/, ""));
          }}
          className="px-3 py-3"
        />
      </div>

      {validationError ? (
        validationError.kind === "prompt" ? (
          <p className="animate-fade-in text-center">{validationError.message}</p>
        ) : (
          <p className={`border rounded-md p-3 mb-3 w-fit mx-auto text-center animate-fade-in ${validationError.kind === "progress" ? "border-green-400" : "border-yellow-400"}`}>{validationError.message}</p>
        )
      ) : (
        <div className="animate-fade-in">
          <div className="mb-6">
            <ColorSwatch color={sharedSecretColor} />
            <div className="text-center"><strong>Shared Secret Color: {sharedSecretColor}</strong></div>
          </div>

          <p>
            Congratulations!  You have successfully shared a secret color with your partner using public key cryptography.
          </p>
          <p>
            Let the eavesdropper know that they can try to guess the shared secret color.  They will not be able to determine the shared secret color without knowing one of the private colors.
          </p>
          <p>
            Because this demonstration uses a limited number of color choices, it may be possible for the eavesdropper to guess the private colors of one or both of their partners.
          </p>
          <p>
            In real life, we use a much larger set of values, and a special math operation so that guessing the secrets is much harder to do.
          </p>
          <p>
            Afterwards, you can check the shared secret color with your partner to confirm that the process worked.
          </p>
        </div>
      )}

      <h2>Learn More</h2>
      <p>
        If you enjoyed this demonstration and would like to learn more about some of the topics presented here, check out some of these resources:
      </p>
      <ul className="list-disc">
        <li>
          <a href="https://maths.straylight.co.uk/archives/108">Understanding Public Key Cryptography with Paint</a> by Graeme Taylor
        </li>
        <li>
          <a href="https://tls12.xargs.org">The Illustrated TLS 1.2 Connection</a> by Michael Driscoll
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange">Diffie–Hellman key exchange</a> on Wikipedia
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Web_colors">Web colors</a> on Wikipedia
        </li>
      </ul>

      <h2>Acknowledgements</h2>
      <p>
        This demonstration was inspired by the excellent blog post by Graeme Taylor at <a href="https://maths.straylight.co.uk/archives/108">https://maths.straylight.co.uk/archives/108</a>.
      </p>
      <p>
        I would also like to thank Alex Orlowski for collaborating with me in planning and delivering a previous form of this exercise as a demonstration during Innovation Day at Firestone Charter Academy in Denver.
      </p>
      <p>
        It turns out mixing colors virtually in the same way that they are mixed with paint in real life is not a simple task!  This page uses <a href="https://github.com/scrtwpns/mixbox">Mixbox</a> by Secret Weapons, which is licensed under <a href="https://www.creativecommons.org/licenses/by-nc/4.0/deed.en">CC BY-NC 4.0</a>.
      </p>

    </main >
  );
}

function FireworkBurst() {
  const colors = ["#fbbf24", "#f472b6", "#22d3ee", "#a3e635", "#fb923c", "#a78bfa", "#60a5fa", "#fb7185"];
  return (
    <span className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {colors.map((color, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full animate-firework"
          style={{
            backgroundColor: color,
            ["--angle" as string]: `${(360 / colors.length) * i}deg`,
          } as React.CSSProperties}
        />
      ))}
    </span>
  );
}

function ClipboardIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
    </svg>
  );
}
