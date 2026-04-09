# Resume Template Download Website (MVP)

Simple full-stack app to browse and download resume templates as DOCX files.

## Stack

- Frontend + Backend in one package
- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: Local files

## Folder structure

- `backend/uploads/docx/` for DOCX templates
- `backend/uploads/previews/` for preview files (image/PDF)

## Add templates manually using JSON

The app now reads templates from:
- `backend/data/templates.json`

### Steps

1. Put DOCX files in `backend/uploads/docx/`
2. Put preview images/PDF in `backend/uploads/previews/` (or PDF in `docx` folder if you prefer)
3. Add/update entries in `backend/data/templates.json`

Example entry:

```json
{
  "id": "modern-blue",
  "title": "Modern Blue Resume",
  "category": "Modern",
  "docxFile": "modern-blue.docx",
  "previewFile": "modern-blue.png",
  "pdfFile": "modern-blue.pdf"
}
```

Notes:
- `docxFile`, `previewFile`, `pdfFile` can be:
  - file names (auto-mapped), or
  - full upload paths like `/uploads/docx/file.docx`.
- `pdfFile` is optional. If `previewFile` is PDF, it is used for Download PDF.

## Run locally

1. Install Node.js (v18+ recommended).
2. From project root:
   - `npm install`
   - `npm run dev`

This starts both services together:
- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

## Environment config (important for custom domains)

Create `frontend/.env.local` when running in a custom dev domain/reverse proxy.

- If frontend and backend are on same origin and `/api` is routed correctly:
  - `VITE_API_BASE=`
- If backend is on a different URL:
  - `VITE_API_BASE=https://api.yourdomain.com`
- If Vite dev proxy should target a custom backend host:
  - `VITE_DEV_API_TARGET=http://127.0.0.1:5000`
  - or `VITE_DEV_API_TARGET=https://api.yourdomain.com`

Notes:
- `VITE_API_BASE` is used by frontend runtime fetch URLs.
- `VITE_DEV_API_TARGET` is only for Vite dev proxy target.
- Avoid hardcoding localhost in code; use env values above.

## Production

From project root:
- `npm run build`
- `npm start`

Express serves the built frontend and API from one process.

## Vercel deployment

If production shows `Failed to fetch templates`, use this setup:

- `api/index.js` exposes Express as a Vercel function.
- `vercel.json` rewrites:
  - `/api/*` -> `/api/index`
  - `/uploads/*` -> `/api/index`

Recommended Vercel project settings:
- Build Command: `npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

For same-domain API on Vercel, keep:
- `VITE_API_BASE=`

## Website pages

- `/` Home page (design + how website works)
- `/download` Template listing page (preview + download)
- `/templates/:id/preview` Dedicated preview and download page

## API endpoints

- `GET /api/templates` list templates
- `GET /api/templates/:id` get template
- `GET /api/templates/:id/download` download DOCX
- `GET /api/templates/:id/preview-download` download preview file
