import { useId, useState } from "react";
import FireworkBurst from "./firework-burst";

export default function CryptColorPicker({ color, setColor, colorChoices }: { color: string, setColor: (color: string) => void, colorChoices: string[] }) {
    const [burst, setBurst] = useState<{ index: number; key: number } | null>(null);
    const groupName = useId();

    const pick = (c: string, i: number) => {
        setColor(c);
        setBurst({ index: i, key: (burst?.key ?? 0) + 1 });
    };

    return (
        <>
            <fieldset>
                <legend className="sr-only">Private color</legend>
                <div className="grid grid-cols-9 grid-rows-[repeat(9,1fr)] aspect-square gap-0">
                    {colorChoices.map((c, i) => (
                        <label
                            key={i}
                            className="cursor-pointer relative has-[:focus-visible]:z-20 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-white has-[:focus-visible]:outline-offset-[-2px]"
                            style={{ backgroundColor: `#${c}` }}
                        >
                            <input
                                type="radio"
                                name={groupName}
                                value={c}
                                checked={color === c}
                                onChange={() => pick(c, i)}
                                // Re-picking the current colour fires click but not change,
                                // so replay the burst here to keep that feedback.
                                onClick={() => { if (color === c) pick(c, i); }}
                                aria-label={`Pick color #${c}`}
                                className="sr-only"
                            />
                            {burst?.index === i && <FireworkBurst key={burst.key} color={`#${color}`} seed={burst.key} />}
                        </label>
                    ))}
                </div>
            </fieldset>
            <div className="mt-3 text-center">
                <strong>#{color}</strong>
            </div>
        </>
    );
}
