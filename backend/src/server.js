const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const BACKEND_ROOT = path.join(__dirname, "..");
const PROJECT_ROOT = path.join(__dirname, "..", "..");
const DATA_FILE = path.join(BACKEND_ROOT, "data", "templates.json");
const DOCX_DIR = path.join(BACKEND_ROOT, "uploads", "docx");
const PREVIEW_DIR = path.join(BACKEND_ROOT, "uploads", "previews");

const ensureDirs = () => {
  [DOCX_DIR, PREVIEW_DIR, path.dirname(DATA_FILE)].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
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

const toUploadPath = (value, type) => {
  if (!value) return "";
  if (value.startsWith("/uploads/")) return value;
  if (value.startsWith("uploads/")) return `/${value}`;
  const fileName = value.replace(/^\/+/, "");
  return type === "docx" ? `/uploads/docx/${fileName}` : `/uploads/previews/${fileName}`;
};

const readTemplatesFromJson = () => {
  let parsed = [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error("Invalid JSON in backend/data/templates.json");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("templates.json must contain an array");
  }

  const templates = parsed
    .filter((item) => item && typeof item === "object")
    .map((item, index) => {
      const docxFile = toUploadPath(item.docxFile, "docx");
      const previewFile = toUploadPath(item.previewFile, "preview");
      const pdfFile = item.pdfFile
        ? toUploadPath(item.pdfFile, "preview")
        : previewFile.toLowerCase().endsWith(".pdf")
          ? previewFile
          : "";
      const idSource = item.id || item.title || docxFile || `template-${index + 1}`;

      return {
        id: slugFromName(String(idSource)),
        title: item.title || titleFromName(docxFile || `template-${index + 1}`),
        description: item.description || "Resume template ready to download.",
        category: item.category || "General",
        docxFile,
        previewFile,
        pdfFile,
        createdAt: item.createdAt || new Date().toISOString(),
      };
    })
    .filter((item) => item.id && item.docxFile);

  return templates.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

app.get("/api/templates", (req, res) => {
  try {
    const templates = readTemplatesFromJson();
    return res.json(templates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/templates/:id", (req, res) => {
  try {
    const templates = readTemplatesFromJson();
    const found = templates.find((t) => t.id === req.params.id);

    if (!found) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.json(found);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/templates/:id/download", (req, res) => {
  try {
    const templates = readTemplatesFromJson();
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/templates/:id/preview-download", (req, res) => {
  try {
    const templates = readTemplatesFromJson();
    const found = templates.find((t) => t.id === req.params.id);

    if (!found) {
      return res.status(404).json({ message: "Template not found" });
    }

    const pdfPath =
      found.pdfFile || (found.previewFile.toLowerCase().includes(".pdf") ? found.previewFile : "");
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;
