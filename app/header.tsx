import Link from 'next/link';
import DarkModeButton from './dark-mode-button';

export default function Header() {
    return (
        <header className="flex mt-20 mb-10 gap-5">
            <Link href="/">
                <strong>Daniel Van Allen</strong>
            </Link>
            <nav className="flex grow m-auto justify-end">
                <ul className="flex gap-5">
                    <li>
                        <Link href="/about">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/projects">
                            Projects
                        </Link>
                    </li>
                </ul>
            </nav>
            <DarkModeButton />
        </header>
    );
};