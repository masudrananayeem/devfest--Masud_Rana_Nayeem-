# AI DevFest Final Problem — Implementation Checklist

## Problem statement coverage

- [x] `requirements.json` validation and ordered requirement list
- [x] Tender metadata display
- [x] Multiple PDF upload
- [x] Non-PDF rejection
- [x] Page count
- [x] File removal
- [x] One-to-one requirement/file matching
- [x] Match change and undo
- [x] Expiry input where `has_expiry=true`
- [x] Immediate status updates
- [x] Exact duplicate detection using SHA-256 content hash
- [x] Duplicate group cannot be used for two different requirements
- [x] Generate disabled for blocking statuses
- [x] `<tender_id>_Package.pdf` download
- [x] English cover page
- [x] Requirement order preserved
- [x] Optional missing documents skipped
- [x] Footer `<tender_id> | Page X of Y` on every page
- [x] Footer reserved with a bottom band so original content is not covered
- [x] English/Bangla UI switch

## Bonus coverage

- [x] Index page
- [x] PNG logo/seal on cover
- [x] PNG signature/seal on document pages
- [x] CSV checklist export
- [x] IndexedDB save/reopen
- [x] Bangla UI
- [x] Filename auto-match suggestions
- [x] PDF preview
- [x] Damaged/password-protected PDF error handling

## Rulebook safety

- No backend code.
- No Firebase/Supabase/Appwrite.
- No participant-controlled database or online document storage.
- All PDF processing is browser-side.
- Uses only static hosting for deployment.
- No API keys or secrets in source.
- MIT License included.

## Real contest timing

The official Rulebook says:

1. During setup, create a new public `devfest-<registration-number>` repository.
2. Do not commit project code before T+0.
3. Start the actual project from zero at T+0.
4. Commit at least once every 30 minutes and at least 3 commits total.
5. Each commit message must state what changed and include the AI prompt, or `Manual edit`.
6. Final eligible commit and matching HTTPS deployment must be ready by T+90.
7. No code/Git/deployment changes after T+90.

## Suggested commit messages for the real contest

### Commit 1 — around T+30

`Create tender workflow and requirements loader | Prompt: Build a frontend-only React tender package builder with requirements.json validation and a responsive bilingual UI.`

### Commit 2 — around T+60

`Add PDF inspection, duplicate detection and matching | Prompt: Add browser-side PDF page counting, SHA-256 duplicate detection, one-to-one matching and exact status rules.`

### Commit 3 — around T+85

`Add package generation and final polish | Prompt: Generate the required English cover and ordered merged PDF with page footer, then polish Bangla/English UI, dark mode and responsive behavior.`
