# Resume Template Download Website (MVP)

Simple full-stack app to upload, browse, and download resume templates as DOCX files.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express + Multer
- Data: JSON file (`backend/data/templates.json`)
- Storage: Local files

## Folder structure

- `backend/uploads/docx/` for DOCX templates
- `backend/uploads/previews/` for preview files (image/PDF)

## Run locally

1. Install Node.js (v18+ recommended).
2. Install backend dependencies:
   - `cd backend`
   - `npm install`
3. Install frontend dependencies:
   - `cd ../frontend`
   - `npm install`
4. Start backend:
   - `cd ../backend`
   - `npm run dev`
5. Start frontend:
   - `cd ../frontend`
   - `npm run dev`

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## API endpoints

- `POST /api/templates` upload template (multipart: title, description, category, docxFile, previewFile)
- `GET /api/templates` list templates
- `GET /api/templates/:id` get template
- `PUT /api/templates/:id` update template fields/files
- `DELETE /api/templates/:id` delete template
- `GET /api/templates/:id/download` download DOCX
