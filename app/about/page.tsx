export default function About() {
  return (
    <main className="flex flex-col">
      <span>
        LinkedIn:&nbsp;
        <a href="https://www.linkedin.com/in/danvanallen">linkedin.com/in/danvanallen</a>
      </span>
      <span>
        GitHub:&nbsp;
        <a href="https://github.com/dvanallen">github.com/dvanallen</a>
      </span>
      <span>
        Resume:&nbsp;
        <a href="/resume.pdf">danielvanallen.org/resume.pdf</a>&nbsp;
        (<a href="/resume.docx">docx</a>)
      </span>

      <h3 className="mt-3">Contact</h3>
      <span>
        Email:&nbsp;
        <a href="mailto:daniel@danielvanallen.org">daniel@danielvanallen.org</a>
      </span>
      <span>
        PGP:&nbsp;
        <a href="http://pgp.mit.edu/pks/lookup?search=0x3854878BD47CDADCE1D3D6A63AE5757AC1FD9D12">3854 878B D47C DADC E1D3 D6A6 3AE5 757A C1FD 9D12</a>
      </span>
    </main>
  );
}
