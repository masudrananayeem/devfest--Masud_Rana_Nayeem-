# Final Rulebook / Problem Audit

## Core requirements
- [x] Frontend-only React/Vite application; no backend/database/service dependency.
- [x] Browser-side PDF parsing, page counting, SHA-256 hashing, preview and PDF generation.
- [x] `requirements.json` validation and requirement sorting by `order`.
- [x] Multiple PDF upload with 30-file / 50 MB limits and non-PDF rejection.
- [x] One requirement ↔ one file matching with change/undo.
- [x] Exact duplicate-content detection and duplicate-group protection.
- [x] Exact Missing / Expiry date needed / Expired / Not provided / OK statuses.
- [x] Same-day expiry as submission deadline is accepted.
- [x] Generate is disabled while a blocking status exists.
- [x] English cover with tender metadata and included-document list.
- [x] Included documents follow requirement order; optional missing documents are skipped.
- [x] Original PDF page order is preserved.
- [x] Footer `<tender_id> | Page X of Y` is added to every generated page with reserved space.
- [x] English/Bangla UI switch.
- [x] No API keys, secrets, Firebase, Supabase, Appwrite or participant-controlled server code.

## Bonus features
- [x] Index page.
- [x] PNG logo on cover.
- [x] Optional PNG signature/seal on selected/all document pages.
- [x] CSV checklist export.
- [x] Browser IndexedDB workspace save/restore.
- [x] Filename-based auto-match suggestions.
- [x] PDF preview and damaged/password-protected PDF handling.
- [x] Branded top application logo and favicon.

## Sample pack verification
- 10 sample PDFs present.
- 1 exact duplicate group: the two experience certificate files.
- 8 mandatory and 2 optional requirements.
- Expected sample mapping is encoded explicitly so the valid 2026 trade license is selected instead of the expired 2025 copy.

## Contest reminder
This project remains a practice/reference implementation. The actual contest requires a new repository and new code created after T+0, with the required commit cadence and final deployment timing.
