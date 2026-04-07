import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getDownloadUrl,
  getFileUrl,
  getPreviewDownloadUrl,
  getTemplate,
} from "../api";

function TemplatePreviewPage() {
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

  if (loading) return <p>Loading preview...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!template) return null;

  return (
    <section>
      <Link to="/download">← Back to Download</Link>
      <h2>{template.title} Preview</h2>
      <p>Check the visual style before downloading your files.</p>

      <div className="detail-preview">
        {!template.previewFile ? (
          <p>No preview file available.</p>
        ) : template.previewFile.endsWith(".pdf") ? (
          <iframe title={`${template.title} preview`} src={getFileUrl(template.previewFile)} />
        ) : (
          <img src={getFileUrl(template.previewFile)} alt={`${template.title} preview`} />
        )}
      </div>

      <div className="row">
        {!!template.previewFile && (
          <a className="button secondary" href={getPreviewDownloadUrl(template.id)}>
            Download Preview
          </a>
        )}
        <a className="button" href={getDownloadUrl(template.id)}>
          Download DOCX
        </a>
      </div>
    </section>
  );
}

export default TemplatePreviewPage;
