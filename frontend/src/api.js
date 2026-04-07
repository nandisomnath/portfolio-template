const rawBase = (import.meta.env.VITE_API_BASE || "").trim();
const API_BASE = rawBase ? rawBase.replace(/\/+$/, "") : "";
const buildUrl = (path) => `${API_BASE}${path}`;

export async function getTemplates() {
  const res = await fetch(buildUrl("/api/templates"));
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}

export async function getTemplate(id) {
  const res = await fetch(buildUrl(`/api/templates/${id}`));
  if (!res.ok) throw new Error("Template not found");
  return res.json();
}

export function getDownloadUrl(id) {
  return buildUrl(`/api/templates/${id}/download`);
}

export function getPreviewDownloadUrl(id) {
  return buildUrl(`/api/templates/${id}/preview-download`);
}

export function getFileUrl(filePath) {
  if (!filePath) return "";
  return buildUrl(filePath);
}
