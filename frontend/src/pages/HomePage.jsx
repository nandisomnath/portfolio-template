import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section>
      <div className="hero">
        <h2>Professional Resume Templates</h2>
        <p>
          Browse ready-made resume layouts, preview the design, and download files instantly.
        </p>
      </div>

      <div className="how-it-works">
        <h3>How this website works</h3>
        <div className="steps">
          <article>
            <strong>1. Browse</strong>
            <p>See all templates added in the uploads directory.</p>
          </article>
          <article>
            <strong>2. Preview</strong>
            <p>Open the preview page to inspect image or PDF style.</p>
          </article>
          <article>
            <strong>3. Download</strong>
            <p>Download DOCX and preview file in one click.</p>
          </article>
        </div>
      </div>
      <div className="how-it-works">
        <h3>Start downloading now</h3>
        <p>Go to the download page to open template previews and download files.</p>
        <Link className="button" to="/download">
          Open Download Page
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
