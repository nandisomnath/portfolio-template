import { useEffect, useState } from "react";
import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  updateTemplate,
} from "../api";

const initialForm = {
  title: "",
  description: "",
  category: "",
  docxFile: null,
  previewFile: null,
};

function AdminPage() {
  const [templates, setTemplates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getTemplates();
      setTemplates(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      if (form.docxFile) fd.append("docxFile", form.docxFile);
      if (form.previewFile) fd.append("previewFile", form.previewFile);

      if (editingId) {
        await updateTemplate(editingId, fd);
        setSuccess("Template updated successfully.");
      } else {
        if (!form.docxFile || !form.previewFile) {
          throw new Error("DOCX and preview files are required.");
        }
        await createTemplate(fd);
        setSuccess("Template uploaded successfully.");
      }

      resetForm();
      await loadTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  const onEdit = (template) => {
    setEditingId(template.id);
    setForm({
      title: template.title,
      description: template.description,
      category: template.category,
      docxFile: null,
      previewFile: null,
    });
    setError("");
    setSuccess("");
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await deleteTemplate(id);
      setSuccess("Template deleted.");
      if (editingId === id) resetForm();
      await loadTemplates();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Admin: Manage Templates</h2>
      <form className="form" onSubmit={onSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={onChange}
          required
        />

        <label>
          DOCX file {editingId ? "(optional when editing)" : ""}
          <input
            type="file"
            name="docxFile"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onChange}
          />
        </label>

        <label>
          Preview file (image or PDF) {editingId ? "(optional when editing)" : ""}
          <input
            type="file"
            name="previewFile"
            accept="image/*,application/pdf"
            onChange={onChange}
          />
        </label>

        <div className="row">
          <button className="button" type="submit">
            {editingId ? "Update Template" : "Upload Template"}
          </button>
          {editingId && (
            <button className="button secondary" type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <h3>Uploaded Templates</h3>
      {loading ? (
        <p>Loading...</p>
      ) : templates.length === 0 ? (
        <p>No templates uploaded yet.</p>
      ) : (
        <div className="admin-list">
          {templates.map((template) => (
            <article key={template.id} className="admin-item">
              <div>
                <h4>{template.title}</h4>
                <p>{template.category}</p>
              </div>
              <div className="row">
                <button className="button secondary" onClick={() => onEdit(template)}>
                  Edit
                </button>
                <button className="button danger" onClick={() => onDelete(template.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminPage;
