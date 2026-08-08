export default function ColorSwatch({ color }: { color: string }) {
    // A span so the swatch stays valid inside a button.
    return (
        <span style={{ backgroundColor: color }} className="block w-1/2 h-32 mx-auto"></span>
    )
}
