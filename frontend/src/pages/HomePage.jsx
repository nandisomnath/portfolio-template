import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFileUrl, getTemplates } from "../api";

function HomePage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTemplates();
        setTemplates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading templates...</p>;
  if (error) return <p className="error">{error}</p>;

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

      {templates.length === 0 ? (
        <p>No templates uploaded yet.</p>
      ) : (
        <div className="grid">
          {templates.map((template) => (
            <article className="card" key={template.id}>
              <Link to={`/templates/${template.id}`}>
                <div className="preview">
                  {!template.previewFile ? (
                    <p>No preview</p>
                  ) : template.previewFile.endsWith(".pdf") ? (
                    <iframe
                      title={`${template.title} preview`}
                      src={getFileUrl(template.previewFile)}
                    />
                  ) : (
                    <img src={getFileUrl(template.previewFile)} alt={template.title} />
                  )}
                </div>
                <h3>{template.title}</h3>
                <p>{template.category}</p>
              </Link>
              <div className="row">
                <Link className="button secondary" to={`/templates/${template.id}/preview`}>
                  Open Preview
                </Link>
                <Link className="button" to={`/templates/${template.id}`}>
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomePage;
