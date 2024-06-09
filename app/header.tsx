import Link from 'next/link';
import DarkModeButton from './dark-mode-button';

export default function Header() {
    return (
        <header className="bg-slate-400 dark:bg-slate-600 px-3 pt-9 pb-4">
            <div className="flex max-w-3xl m-auto gap-5">
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