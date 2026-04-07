import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFileUrl, getTemplates } from "../api";

function DownloadPage() {
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
      <h2>Download Templates</h2>
      <p>Preview each design and download the DOCX template you like.</p>

      {templates.length === 0 ? (
        <p>No templates uploaded yet.</p>
      ) : (
        <div className="grid">
          {templates.map((template) => (
            <article className="card" key={template.id}>
              <Link className="card-main" to={`/templates/${template.id}/preview`}>
                <div className="preview">
                  {!template.previewFile ? (
                    <p>No preview</p>
                  ) : template.previewFile.toLowerCase().includes(".pdf") ? (
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DownloadPage;
