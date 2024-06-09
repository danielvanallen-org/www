export default function CryptColors() {
    return (
        <main>
            <div>
                <h1>Crypt Colors</h1>
                <p>Explore public key cryptography by mixing paint to share a secret color!</p>
                <p>
                    Try it here: <a href="https://www.cryptcolors.com">cryptcolors.com</a>.
                </p>
                <h2>About</h2>
                <p>
                    The website provides a simplified demonstration of how public-key cryptography works, aimed at novice users of middle-school age or older.
                </p>
                <p>
                    Originally I presented a version of this website with Alex Orlowski during a Google Serve volunteer opportunity.  We went to Firestone Charter Academy in Denver, CO, and presented the demonstration to several groups of middle school kids.
                </p>
                <p>
                    The original website was just plain Javascript with a third-party color picker that I threw together in a few hours, but this updated version is a lightweight Next.js app with some nicer styling.
                </p>
                <p>
                    One of the main improvements in this version is the color mixing logic.  Originally I had just picked values by averaging the RGB values of the pairs of colors, which works, but it tends to give greyish results which are not what you would expect from mixing paint in real life.
                </p>
                <p>
                    For example, if you mix bright blue with bright yellow, you would expect to get bright green out of it.  But if you just average the RGB values, you get... gross yellow.
                </p>
                <p>
                    To solve this problem I went down a path of <a href="https://stackoverflow.com/q/6130621">StackOverflow</a> which led me to an <a href="https://www.fastcompany.com/3002676/magical-tech-behind-paper-ipads-color-mixing-perfection">article about an app called Paper</a> which supports paint-color mixing by implementing the <a href="https://en.wikipedia.org/wiki/Kubelka–Munk_theory">Kubelka-Munk</a> mixing algorithm in RGB space.
                </p>
                <p>
                    After a bit of further searching I found that they had generously open-sourced a <a href="https://github.com/scrtwpns/mixbox">Mixbox</a> library to perform this mixing logic in various languages.
                </p>
                <h2>Acknowledgements</h2>
                <p>
                    This demonstration was inspired by the excellent blog post by Graeme Taylor at <a href="https://maths.straylight.co.uk/archives/108">https://maths.straylight.co.uk/archives/108</a>.
                </p>
                <p>
                    I would also like to thank Alex Orlowski for collaborating with me in planning and delivering a previous form of this exercise.
                </p>
            </div>
        </main>
    );
};