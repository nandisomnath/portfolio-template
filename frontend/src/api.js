const API_BASE = "http://localhost:5000";

export async function getTemplates() {
  const res = await fetch(`${API_BASE}/api/templates`);
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function getTemplate(id) {
  const res = await fetch(`${API_BASE}/api/templates/${id}`);
  if (!res.ok) throw new Error("Template not found");
  return res.json();
}

export async function createTemplate(formData) {
  const res = await fetch(`${API_BASE}/api/templates`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to upload template");
  }
  return res.json();
}

export async function updateTemplate(id, formData) {
  const res = await fetch(`${API_BASE}/api/templates/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update template");
  }
  return res.json();
}

export async function deleteTemplate(id) {
  const res = await fetch(`${API_BASE}/api/templates/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete template");
  return res.json();
}

export function getDownloadUrl(id) {
  return `${API_BASE}/api/templates/${id}/download`;
}

export function getFileUrl(filePath) {
  if (!filePath) return "";
  return `${API_BASE}${filePath}`;
}
