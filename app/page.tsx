import Link from "next/link";

export default function Home() {
    return (
        <main>
            <div>
                <p>
                    I&apos;m a software engineer with 10+ years of experience in backend development and edge network deployments.
                    Here you can find some of my <Link href="/projects">projects</Link> and <Link href="about">contact</Link> information.
                </p>
                <p>
                    Most recently, I was the engineering manager and tech lead for the backend Platform team at <a href="https://cape.co">Cape</a>.  Cape is a Mobile Virtual Network Operator (MVNO) building a cellular network that doesn&apos;t collect or sell any of your personal information.  They also use identifier rotation to help obfuscate their users while making use of partner cell towers.
                </p>
                <p>
                    Before Cape, I spent five years at Google, where I worked on the <a href="https://cloud.google.com/distributed-cloud/edge/latest/docs/overview">Google Distributed Cloud Connected</a> platform and <a href="https://peering.google.com">Google Global Cache</a>, which is the content delivery network (CDN) that hosts YouTube videos.
                </p>
                <p>
                    I also worked on improving the security of the Internet by processing and displaying BGP IRR and RPKI data in the Google Peering Portal.
                    You can find coverage of this work in the <Link href="https://dl.acm.org/doi/abs/10.1145/3469287">Communications of the ACM</Link> and <Link href="https://www.wired.com/story/bgp-routing-manrs-google-fix/">Wired</Link>.
                </p>
            </div>
        </main>
    );
}
