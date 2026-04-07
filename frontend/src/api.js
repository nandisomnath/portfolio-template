const API_BASE = import.meta.env.VITE_API_BASE || "";

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

export function getDownloadUrl(id) {
  return `${API_BASE}/api/templates/${id}/download`;
}

export function getPreviewDownloadUrl(id) {
  return `${API_BASE}/api/templates/${id}/preview-download`;
}

export function getFileUrl(filePath) {
  if (!filePath) return "";
  return `${API_BASE}${filePath}`;
}
