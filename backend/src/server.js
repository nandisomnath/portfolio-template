const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

const ROOT_DIR = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT_DIR, "data", "templates.json");
const DOCX_DIR = path.join(ROOT_DIR, "uploads", "docx");
const PREVIEW_DIR = path.join(ROOT_DIR, "uploads", "previews");

const ensureDirs = () => {
  [path.dirname(DATA_FILE), DOCX_DIR, PREVIEW_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf-8");
  }
};

const readTemplates = () => {
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
};

const writeTemplates = (templates) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2), "utf-8");
};

ensureDirs();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(ROOT_DIR, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "docxFile") return cb(null, DOCX_DIR);
    if (file.fieldname === "previewFile") return cb(null, PREVIEW_DIR);
    return cb(new Error("Unexpected field"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "docxFile" &&
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return cb(null, true);
  }

  if (
    file.fieldname === "previewFile" &&
    (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf")
  ) {
    return cb(null, true);
  }

  return cb(new Error(`Invalid file type for ${file.fieldname}`));
};

const upload = multer({ storage, fileFilter });

app.get("/api/templates", (req, res) => {
  const templates = readTemplates();
  res.json(templates);
});

app.get("/api/templates/:id", (req, res) => {
  const templates = readTemplates();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  return res.json(found);
});

app.post(
  "/api/templates",
  upload.fields([
    { name: "docxFile", maxCount: 1 },
    { name: "previewFile", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, description, category } = req.body;
    const docxFile = req.files.docxFile?.[0];
    const previewFile = req.files.previewFile?.[0];

    if (!title || !description || !category || !docxFile || !previewFile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const templates = readTemplates();
    const newTemplate = {
      id: uuidv4(),
      title,
      description,
      category,
      docxFile: `/uploads/docx/${docxFile.filename}`,
      previewFile: `/uploads/previews/${previewFile.filename}`,
      createdAt: new Date().toISOString(),
    };

    templates.unshift(newTemplate);
    writeTemplates(templates);
    return res.status(201).json(newTemplate);
  }
);

app.put(
  "/api/templates/:id",
  upload.fields([
    { name: "docxFile", maxCount: 1 },
    { name: "previewFile", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, description, category } = req.body;
    const templates = readTemplates();
    const index = templates.findIndex((t) => t.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ message: "Template not found" });
    }

    const current = templates[index];
    const docxFile = req.files.docxFile?.[0];
    const previewFile = req.files.previewFile?.[0];

    const updated = {
      ...current,
      title: title || current.title,
      description: description || current.description,
      category: category || current.category,
      docxFile: docxFile ? `/uploads/docx/${docxFile.filename}` : current.docxFile,
      previewFile: previewFile
        ? `/uploads/previews/${previewFile.filename}`
        : current.previewFile,
    };

    templates[index] = updated;
    writeTemplates(templates);
    return res.json(updated);
  }
);

app.delete("/api/templates/:id", (req, res) => {
  const templates = readTemplates();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  const next = templates.filter((t) => t.id !== req.params.id);
  writeTemplates(next);

  const docxPath = path.join(ROOT_DIR, found.docxFile.replace(/^\//, ""));
  const previewPath = path.join(ROOT_DIR, found.previewFile.replace(/^\//, ""));

  [docxPath, previewPath].forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });

  return res.json({ message: "Template deleted" });
});

app.get("/api/templates/:id/download", (req, res) => {
  const templates = readTemplates();
  const found = templates.find((t) => t.id === req.params.id);

  if (!found) {
    return res.status(404).json({ message: "Template not found" });
  }

  const filePath = path.join(ROOT_DIR, found.docxFile.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "DOCX file not found on disk" });
  }

  const safeTitle = found.title.replace(/[^\w\-]+/g, "_");
  return res.download(filePath, `${safeTitle}.docx`);
});

app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  return next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend running at http://localhost:${PORT}`);
});
