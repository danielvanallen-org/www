// Stable hash: same (i, salt) always returns the same [0, 1) value.
// Lets the seed (burst counter) vary jitter while staying deterministic per render.
const hash = (i: number, salt: number) =>
    Math.abs((Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453) % 1);

type Particle = { angle: number; dist: number; gravity: number; big: boolean };

const PATTERN_COUNT = 3;

function generateParticles(pattern: number, seed: number): Particle[] {
    const h = (i: number, k: number) => hash(i, seed * 7 + k);
    switch (pattern) {
        case 0: { // ring — even spread, light gravity
            const N = 26;
            return Array.from({ length: N }, (_, i) => ({
                angle: (360 / N) * i + h(i, 0) * 14,
                dist: 130 + h(i, 1) * 80,
                gravity: 35 + h(i, 2) * 35,
                big: i % 4 === 0,
            }));
        }
        case 1: { // willow — dense, heavy gravity, particles arc and fall
            const N = 32;
            return Array.from({ length: N }, (_, i) => ({
                angle: (360 / N) * i + h(i, 0) * 20,
                dist: 80 + h(i, 1) * 60,
                gravity: 110 + h(i, 2) * 70,
                big: false,
            }));
        }
        case 2: { // double ring — two concentric shells
            const N = 28;
            return Array.from({ length: N }, (_, i) => {
                const inner = i % 2 === 0;
                return {
                    angle: (360 / N) * i + h(i, 0) * 10,
                    dist: inner ? 80 + h(i, 1) * 25 : 170 + h(i, 2) * 40,
                    gravity: 30 + h(i, 0) * 30,
                    big: !inner,
                };
            });
        }
    }
    return [];
}

const RAINBOW_PALETTE = [
    "#fbbf24", "#f472b6", "#22d3ee", "#a3e635",
    "#fb923c", "#a78bfa", "#60a5fa", "#fb7185",
];

const SIZE_SCALE = { sm: 0.4, md: 1.5 } as const;
const PARTICLE_CLASSES = {
    sm: { big: "w-3 h-0.5 -mt-px -ml-[6px]", small: "w-2 h-px -ml-1" },
    md: { big: "w-10 h-2 -mt-1 -ml-5", small: "w-7 h-1 -mt-[2px] -ml-[14px]" },
} as const;

type FireworkBurstProps = { seed: number; size?: keyof typeof SIZE_SCALE } & (
    | { color: string; rainbow?: false }
    | { rainbow: true; color?: never }
);

export default function FireworkBurst(props: FireworkBurstProps) {
    const { seed, size = "md" } = props;
    const scale = SIZE_SCALE[size];
    const classes = PARTICLE_CLASSES[size];
    const pattern = seed % PATTERN_COUNT;
    const particles = generateParticles(pattern, seed);
    const colorFor = (i: number) =>
        "rainbow" in props && props.rainbow
            ? RAINBOW_PALETTE[i % RAINBOW_PALETTE.length]
            : (props as { color: string }).color;
    return (
        <span className="absolute inset-0 pointer-events-none z-10">
            {particles.map((p, i) => {
                const sizeClass = p.big ? classes.big : classes.small;
                return (
                    // Outer = gravity (ease-in). Inner = burst (ease-out).
                    // Splitting them lets each axis have its own physics curve.
                    <span
                        key={i}
                        className="absolute top-1/2 left-1/2 w-0 h-0 animate-firework-fall"
                        style={{ ["--gravity" as string]: `${p.gravity * scale}px` } as React.CSSProperties}
                    >
                        <span
                            className={`absolute ${sizeClass} rounded-sm animate-firework-burst`}
                            style={{
                                backgroundColor: colorFor(i),
                                ["--angle" as string]: `${p.angle}deg`,
                                ["--dist" as string]: `${p.dist * scale}px`,
                            } as React.CSSProperties}
                        />
                    </span>
                );
            })}
        </span>
    );
}
