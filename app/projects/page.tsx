import Link from 'next/link';
import Image from 'next/image';

export default function Projects() {
    const projects = [
        {
            id: 'cryptcolors',
            name: 'Crypt Colors',
            img: 'cryptcolors.svg',
            desc: 'Learn about asymmetric public key cryptography by mixing colors of paint.'
        },
        {
            id: 'deepsouth',
            name: 'Deep South',
            img: 'deepsouth.png',
            desc: 'A small (work in progress) game about my haunted apartment in Arkansas, written in Godot Engine.'
        }
    ];

    return (
        <main className="max-w-4xl">
            <div className="flex flex-wrap m-auto">
            {projects.map((project) => (
                <Link href={`/projects/${project.id}`} key={project.id} className="m-5">
                    <div className="max-w-sm rounded overflow-hidden shadow-lg">
                        <div className="bg-white dark:bg-gray-900">
                            <Image src={`/${project.img}`} alt={project.name} width={400} height={250} className="w-full" />
                            <div className="px-6 py-4">
                                <h3>{project.name}</h3>
                                <p>{project.desc}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
        </main>
    );
};