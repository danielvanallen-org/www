import Link from 'next/link';

export default function Projects() {
    const projects = [
        { id: 'cryptcolors', name: 'Crypt Colors' }
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {projects.map((project) => (
                <div key={project.id} style={{ width: '300px', margin: '10px' }}>
                    <Link href={`/projects/${project.id}`}>
                        {project.name}
                    </Link>
                </div>
            ))}
        </div>
    );
};