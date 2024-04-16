import Link from "next/link";

export default function Home() {
    return (
        <main>
            <div>
                <p>
                    I&apos;m a software engineer with ten years of experience in backend development and edge network deployments. Here you can find some of my <Link href="/projects">projects</Link> and <Link href="about">contact</Link> information.
                </p>
                <p>
                    At my recent job at Google, I worked on the <a href="https://cloud.google.com/distributed-cloud/edge/latest/docs/overview">Google Distributed Cloud Edge</a> platform and <a href="https://peering.google.com">Google Global Cache</a>, which is the content delivery network (CDN) that hosts YouTube videos.
                </p>
                <p>
                    I also worked on improving the security of the Internet by processing and displaying BGP IRR and RPKI data in the Google Peering Portal. You can find coverage of this work in the <Link href="https://dl.acm.org/doi/abs/10.1145/3469287">Communications of the ACM</Link> and <Link href="https://www.wired.com/story/bgp-routing-manrs-google-fix/">Wired</Link>.
                </p>
                <p>
                    I am currently open to:
                </p>
                <ul className="list-disc">
                    <li>
                        short or long term contracting projects
                    </li>
                    <li>
                        full-time opportunities
                    </li>
                </ul>
                <p>
                    If you would like to work together, please reach out using the information on my <Link href="/about">about</Link> page.
                </p>
            </div>
        </main>
    );
}