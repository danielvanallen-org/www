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
        This site:&nbsp;
        <a href="https://github.com/danielvanallen-org/www">github.com/danielvanallen-org/www</a>
      </p>

      <h3 className="mt-3">Contact</h3>
      <p>
        Business:&nbsp;
        <a href="mailto:daniel@danielvanallen.org">daniel@danielvanallen.org</a>
        <br />
        Personal:&nbsp;
        <a href="mailto:danvanallen@gmail.com">danvanallen@gmail.com</a>
        <br />
        PGP:&nbsp;
        <a className="external" href="http://pgp.mit.edu/pks/lookup?search=0x3854878BD47CDADCE1D3D6A63AE5757AC1FD9D12">3854 878B D47C DADC E1D3 D6A6 3AE5 757A C1FD 9D12</a>
      </p>
    </main>
  );
}
