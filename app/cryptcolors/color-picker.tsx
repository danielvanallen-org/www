import { useState } from "react";
import FireworkBurst from "./firework-burst";

export default function CryptColorPicker({ color, setColor, colorChoices }: { color: string, setColor: (color: string) => void, colorChoices: string[] }) {
    const [burst, setBurst] = useState<{ index: number; key: number } | null>(null);

    const pick = (c: string, i: number) => {
        setColor(c);
        setBurst({ index: i, key: (burst?.key ?? 0) + 1 });
    };

    return (
        <>
            <div role="radiogroup" aria-label="Private color" className="grid grid-cols-9 grid-rows-[repeat(9,1fr)] aspect-square gap-0">
                {colorChoices.map((c, i) => (
                    <button
                        key={i}
                        type="button"
                        role="radio"
                        aria-checked={color === c}
                        aria-label={`Pick color #${c}`}
                        className="cursor-pointer relative p-0 border-0 focus:outline-none focus-visible:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[-2px]"
                        style={{ backgroundColor: `#${c}` }}
                        onClick={() => pick(c, i)}
                    >
                        {burst?.index === i && <FireworkBurst key={burst.key} color={`#${color}`} seed={burst.key} />}
                    </button>
                ))}
            </div>
            <div className="mt-3 text-center">
                <strong>#{color}</strong>
            </div>
        </>
    );
}
