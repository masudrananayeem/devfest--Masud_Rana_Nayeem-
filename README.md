# Tender Document Package Builder — React Practice Implementation

A frontend-only React/Vite implementation of the AI DevFest **Tender Document Package Builder** problem.

## Core requirements implemented

- Import and validate `requirements.json`
- Upload up to 30 PDFs / 50 MB total
- Reject non-PDFs and safely report unreadable/password-protected PDFs
- Count PDF pages in-browser with PDF.js
- Match one uploaded PDF to at most one requirement and vice versa
- Enter expiry dates for documents where `has_expiry=true`
- Exact status logic: Missing, Expiry date needed, Expired, Not provided, OK
- SHA-256 content duplicate detection
- Duplicate content cannot be matched to different requirements
- Immediate status recalculation after changes
- English/Bangla UI
- Auto-match suggestions based on filenames
- PDF preview in a new browser tab
- Generate one combined PDF in requirement order
- English cover page with tender metadata and included-document list
- Footer on every page: `<tender_id> | Page X of Y`
- Browser-only processing; no backend, Firebase, Supabase, Appwrite, or remote document storage

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

## Practice pack

This practice build includes the supplied sample pack under `public/sample-pack/`.
Click **Load practice pack** to load its `requirements.json` and all sample PDFs automatically, then review the suggested matches and enter expiry dates.

The real contest supplies the pack at T+0. In the contest, do not use pre-created project code: recreate the app from zero during the permitted contest window as required by the official rulebook.

## Practice sample resolution

For the supplied sample pack:

- R01 → `trade_license_2026.pdf` (valid through 2027-06-30)
- R02 → `03_tin_certificate.pdf`
- R03 → `04_vat_certificate.pdf`
- R04 → `bank_solvency.pdf` (valid through 2026-12-31)
- R05 → one of the identical `experience_cert` PDFs; the other is a duplicate
- R06 → optional / not provided
- R07 → optional / not provided
- R08 → `02_technical_proposal.pdf`
- R09 → `01_financial_proposal.pdf`
- R10 → `scan_0042.pdf`

The 2025 trade license is expired and should not be used for R01.

## Contest deployment

Static hosting works. Example settings:

- Build command: `npm run build`
- Output directory: `dist`

Cloudflare Pages, Vercel, Netlify, or GitHub Pages can be used according to the official rules.

## Important contest restriction

This repository is a practice/reference implementation. The official rulebook requires project code to be created during the contest after T+0. Do not submit this pre-created source as your contest code.
