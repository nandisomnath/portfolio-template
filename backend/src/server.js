const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const BACKEND_ROOT = path.join(__dirname, "..");
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const DOCX_DIR = path.join(BACKEND_ROOT, "uploads", "docx");
const PREVIEW_DIR = path.join(BACKEND_ROOT, "uploads", "previews");

const ensureDirs = () => {
  [DOCX_DIR, PREVIEW_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

ensureDirs();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(BACKEND_ROOT, "uploads")));

const slugFromName = (fileName) =>
  path
    .parse(fileName)
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const titleFromName = (fileName) =>
  path
    .parse(fileName)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getTemplatesFromFiles = () => {
  const docxDirFiles = fs
    .readdirSync(DOCX_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
  const docxFiles = docxDirFiles.filter((file) => path.extname(file).toLowerCase() === ".docx");
  const pdfFilesInDocx = docxDirFiles.filter((file) => path.extname(file).toLowerCase() === ".pdf");

  const previewFiles = fs
    .readdirSync(PREVIEW_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);

  const previewBySlug = new Map();
  previewFiles.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".webp", ".gif", ".pdf"].includes(ext)) return;
    const slug = slugFromName(file);
    if (!previewBySlug.has(slug)) previewBySlug.set(slug, file);
  });

  const pdfInDocxBySlug = new Map();
  pdfFilesInDocx.forEach((file) => {
    const slug = slugFromName(file);
    if (!pdfInDocxBySlug.has(slug)) pdfInDocxBySlug.set(slug, file);
  });

  const templates = docxFiles.map((docxName) => {
    const slug = slugFromName(docxName);
    const previewName = previewBySlug.get(slug);
    const pdfDocxName = pdfInDocxBySlug.get(slug);
    const previewFilePath = previewName
      ? `/uploads/previews/${previewName}`
      : pdfDocxName
        ? `/uploads/docx/${pdfDocxName}`
        : "";
    return {
      id: slug,
      title: titleFromName(docxName),
      description: "Resume template ready to download.",
      category: "General",
      docxFile: `/uploads/docx/${docxName}`,
      previewFile: previewFilePath,
      pdfFile: pdfDocxName ? `/uploads/docx/${pdfDocxName}` : "",
      createdAt: fs.statSync(path.join(DOCX_DIR, docxName)).ctime.toISOString(),
    };
  });

  return templates.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

app.get("/api/templates", (req, res) => {
  const templates = getTemplatesFromFiles();
  res.json(templates);
});

app.get("/api/templates/:id", (req, res) => {
  const templates = getTemplatesFromFiles();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  return res.json(found);
});

app.get("/api/templates/:id/download", (req, res) => {
  const templates = getTemplatesFromFiles();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  const filePath = path.join(BACKEND_ROOT, found.docxFile.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "DOCX file not found on disk" });
  }

  const safeTitle = found.title.replace(/[^\w\-]+/g, "_");
  return res.download(filePath, `${safeTitle}.docx`);
});

app.get("/api/templates/:id/preview-download", (req, res) => {
  const templates = getTemplatesFromFiles();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  const pdfPath = found.pdfFile || (found.previewFile.toLowerCase().includes(".pdf") ? found.previewFile : "");
  if (!pdfPath) {
    return res.status(404).json({ message: "PDF file not found for this template" });
  }

  const filePath = path.join(BACKEND_ROOT, pdfPath.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "PDF file not found on disk" });
  }

  const safeTitle = found.title.replace(/[^\w\-]+/g, "_");
  const ext = path.extname(filePath).toLowerCase();
  return res.download(filePath, `${safeTitle}-preview${ext}`);
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  return next();
});

const FRONTEND_DIST = path.join(PROJECT_ROOT, "frontend", "dist");
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    return res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${PORT}`);
});
