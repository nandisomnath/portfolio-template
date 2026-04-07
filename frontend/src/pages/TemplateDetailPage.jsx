import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDownloadUrl, getFileUrl, getTemplate } from "../api";

function TemplateDetailPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTemplate(id);
        setTemplate(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p>Loading template...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!template) return null;

  return (
    <section>
      <Link to="/">← Back</Link>
      <h2>{template.title}</h2>
      <p>{template.description}</p>
      <p>
        <strong>Category:</strong> {template.category}
      </p>
      <div className="detail-preview">
        {!template.previewFile ? (
          <p>No preview available for this template.</p>
        ) : template.previewFile.endsWith(".pdf") ? (
          <iframe title={`${template.title} preview`} src={getFileUrl(template.previewFile)} />
        ) : (
          <img src={getFileUrl(template.previewFile)} alt={template.title} />
        )}
      </div>
      <a className="button" href={getDownloadUrl(template.id)}>
        Download DOCX
      </a>
    </section>
  );
}

export default TemplateDetailPage;
