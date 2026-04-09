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
            <strong>1. Browse Templates</strong>
            <p>Explore our collection of professional resume templates with preview images.</p>
          </article>
          <article>
            <strong>2. Preview & Download</strong>
            <p>View detailed previews and download PPTX template files instantly.</p>
          </article>
          <article>
            <strong>3. Edit with Your Favorite Software</strong>
            <p>Open the downloaded PPTX file in Microsoft PowerPoint, Google Slides, LibreOffice, or any PPTX-compatible software.</p>
          </article>
          <article>
            <strong>4. Customize Your Resume</strong>
            <p>Replace placeholder text with your personal information, adjust colors, fonts, and layout to match your style.</p>
          </article>
          <article>
            <strong>5. Export as PDF or Image</strong>
            <p>Save your customized resume as PDF for professional use or as JPG/PNG for digital sharing.</p>
          </article>
        </div>
      </div>

      <div className="how-it-works">
        <h3>Compatible Software</h3>
        <p>You can edit these templates with any PPTX-compatible software:</p>
        <ul className="software-list">
          <li><strong>Microsoft PowerPoint</strong> - Professional editing features</li>
          <li><strong>Google Slides</strong> - Free, cloud-based editing</li>
          <li><strong>LibreOffice Impress</strong> - Free open-source alternative</li>
          <li><strong>Apple Keynote</strong> - For Mac users</li>
          <li><strong>WPS Office</strong> - Free office suite alternative</li>
        </ul>
      </div>

      <div className="how-it-works">
        <h3>Start Creating Your Resume</h3>
        <p>Ready to create a professional resume? Browse our templates and get started today.</p>
        <p className="note"><em>Note: More templates will be added regularly to give you even more options!</em></p>
        <Link className="button" to="/download">
          Browse Templates
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
