# Tender Document Package Builder — React Practice Build

A frontend-only React implementation for the AI DevFest **Tender Document Package Builder** problem.

> **Contest rule reminder:** this project is a practice/reference implementation. The official Rulebook requires participants to start from zero at T+0 and prohibits using pre-written project code, old projects, or old templates in the real contest.

## What this build implements

### Main tasks
- Load and validate `requirements.json`.
- Show tender details and requirements sorted by `order`.
- Upload many PDFs at once.
- Reject non-PDF files with a clear message.
- Enforce the 30-file / 50 MB limits.
- Count PDF pages in the browser.
- Preview PDFs in Chrome.
- Remove individual files or clear the whole set.
- Match one PDF to at most one requirement and one requirement to at most one PDF.
- Change/undo matches at any time.
- SHA-256 content hashing for exact duplicate detection.
- Prevent identical duplicate content from being matched to two requirements.
- Enter expiry dates for `has_expiry: true` requirements.
- Apply the exact status rules: Missing, Expiry date needed, Expired, Not provided, OK.
- Keep Generate disabled while any blocking status exists.
- Generate `<tender_id>_Package.pdf` entirely in the browser.
- English cover page with tender information and included document list.
- Optional index page (bonus feature).
- Preserve original document order and page order.
- Add a readable footer to every page without covering original document content.
- Download the final PDF.
- Switch the complete UI between English and Bangla.
- Dark/night mode.
- Branded app logo and favicon.

### Bonus features included
- Filename-based auto-match suggestions.
- Save/reopen workspace using browser IndexedDB.
- Export the checklist as CSV.
- PNG logo/seal on the cover.
- Optional PNG signature/seal on generated document pages.
- PDF preview.
- Safer handling of damaged/password-protected PDFs.
- Drag-and-drop upload.
- Search uploaded files.

## Technology

- React 18
- Vite
- pdf-lib
- pdf.js (`pdfjs-dist`)
- Lucide React
- Browser File API
- Web Crypto SHA-256
- IndexedDB

No Firebase, Supabase, Appwrite, custom backend, database, or serverless function is used.

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

## Practice workflow

1. Click **Load practice pack**.
2. The bundled `requirements.json` and supplied PDFs are loaded in the browser.
3. Review the suggested matches. The bundled practice pack preselects the valid 2026 trade license and fills the sample expiry dates.
4. Confirm or edit the prefilled expiry dates:
   - Trade License: `2027-06-30`
   - Bank Solvency Certificate: `2026-12-31`
5. Confirm every requirement status.
6. Optional requirements without files should show **Not provided** and must not block generation.
7. Click **Generate package**.
8. The sample output is also included under `output/`.

## Supplied practice pack resolution

- R01 → `trade_license_2026.pdf`
- R02 → `03_tin_certificate.pdf`
- R03 → `04_vat_certificate.pdf`
- R04 → `bank_solvency.pdf`
- R05 → `experience_cert.pdf`
- R06 → Not provided (optional)
- R07 → Not provided (optional)
- R08 → `02_technical_proposal.pdf`
- R09 → `01_financial_proposal.pdf`
- R10 → `scan_0042.pdf`

`experience_cert.pdf` and `experience_cert (1).pdf` are byte-identical and are therefore flagged as duplicate content. Only one can be matched.

`trade_license_2025.pdf` is expired, so the valid `trade_license_2026.pdf` should be selected.

## Contest-compliance checklist

The official Rulebook requires:

- Frontend-only browser application.
- No participant-controlled persistent backend/database/online storage.
- React/npm libraries are allowed.
- Start from zero at T+0; no pre-existing project code in the actual contest.
- Bangla + English.
- Public HTTPS deployment by T+90.
- At least 3 commits, at least once every 30 minutes.
- Every commit message must mention what changed and the AI prompt used, or `Manual edit`.
- Final eligible commit and matching deployment must be complete by T+90.
- MIT License.

See the supplied official Rulebook and Problem Statement for the authoritative contest rules.

## AI prompt used for this practice implementation

> Build a frontend-only React tender document package builder. Load and validate requirements.json, accept up to 30 PDFs/50 MB, count pages in-browser, SHA-256 hash each file, detect exact duplicates, allow one-to-one requirement/file matching, validate expiry dates against submission_deadline, show exact blocking statuses, and generate a combined PDF with an English cover, optional index, original pages in requirement order, and `<tender_id> | Page X of Y` on every page without covering original content. Add complete Bangla/English UI, dark mode, PDF preview, auto-match suggestions, IndexedDB workspace save/restore, CSV checklist export, and optional PNG logo/signature features. Use no backend, Firebase, Supabase, Appwrite, or persistent server storage.

## License

MIT
