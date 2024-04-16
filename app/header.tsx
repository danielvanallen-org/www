import Link from 'next/link';
import DarkModeButton from './dark-mode-button';

export default function Header() {
    return (
        <header className="bg-slate-400 dark:bg-slate-500 px-3 pb-3 mb-10">
            <div className="flex max-w-3xl m-auto pt-10 gap-5">
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
            </div>
        </header>
    );
};