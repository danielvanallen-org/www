export default function About() {
  return (
    <main className="flex-col">
      <p>
        LinkedIn:&nbsp;
        <a href="https://www.linkedin.com/in/danvanallen">linkedin.com/in/danvanallen</a>
        <br />
        GitHub:&nbsp;
        <a href="https://github.com/dvanallen">github.com/dvanallen</a>
        <br />
        Resume:&nbsp;
        <a href="/resume.pdf">danielvanallen.org/resume.pdf</a>&nbsp;
        (<a href="/resume.docx">docx</a>)
      </p>

      <h3 className="mt-3">Contact</h3>
      <p>
        Email:&nbsp;
        <a href="mailto:daniel@danielvanallen.org">daniel@danielvanallen.org</a>
        <br />
        PGP:&nbsp;
        <a className="external" href="http://pgp.mit.edu/pks/lookup?search=0x3854878BD47CDADCE1D3D6A63AE5757AC1FD9D12">3854 878B D47C DADC E1D3 D6A6 3AE5 757A C1FD 9D12</a>
      </p>
    </main>
  );
}
