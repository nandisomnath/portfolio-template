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

## Add templates manually (no admin panel)

1. Put your `.docx` files inside `backend/uploads/docx/`
2. Put preview image/PDF files inside `backend/uploads/previews/`
3. Use matching base names so they pair automatically.

Example:
- `backend/uploads/docx/modern-blue.docx`
- `backend/uploads/previews/modern-blue.png`

If no preview exists, the site still shows the template with "No preview".

## Run locally

1. Install Node.js (v18+ recommended).
2. From project root:
   - `npm install`
   - `npm run dev`

This starts both services together:
- frontend on `http://localhost:5173`
- backend on `http://localhost:5000`

## Production

From project root:
- `npm run build`
- `npm start`

Express serves the built frontend and API from one process.

## API endpoints

- `GET /api/templates` list templates
- `GET /api/templates/:id` get template
- `GET /api/templates/:id/download` download DOCX
- `GET /api/templates/:id/preview-download` download preview file
