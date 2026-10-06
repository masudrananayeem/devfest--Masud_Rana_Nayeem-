# Setup Guide

## 1. Requirements

Use a recent Node.js installation and Google Chrome.

## 2. Install

```bash
npm install
```

## 3. Start

```bash
npm run dev
```

Then open the local Vite URL, normally `http://localhost:5173`.

## 4. Practice pack

Click **Load practice pack**. The practice files are bundled under `public/sample-pack/` so the app can rehearse the complete workflow without a backend.

Expected blocking issues after loading:

- R01 Missing/Expiry date needed until the valid 2026 trade license is matched and its expiry date is entered.
- R04 Expiry date needed until `2026-12-31` is entered.
- R06 and R07 are optional, so their missing files are `Not provided` and do not block.

The suggested final state is:

- R01 OK — `trade_license_2026.pdf` — `2027-06-30`
- R02 OK — `03_tin_certificate.pdf`
- R03 OK — `04_vat_certificate.pdf`
- R04 OK — `bank_solvency.pdf` — `2026-12-31`
- R05 OK — `experience_cert.pdf`
- R06 Not provided
- R07 Not provided
- R08 OK — `02_technical_proposal.pdf`
- R09 OK — `01_financial_proposal.pdf`
- R10 OK — `scan_0042.pdf`

## 5. Test duplicate protection

Both `experience_cert.pdf` and `experience_cert (1).pdf` have identical content. The app flags both as duplicate content and prevents the same content group from being assigned to two different requirements.

## 6. Test the expiry rule

The same-day rule is supported: an expiry date equal to the submission deadline is valid.

Example:

```text
Submission deadline: 2026-10-20
Expiry:             2026-10-20
Result:             OK
```

An earlier date is `Expired` and blocks generation.

## 7. Test generated PDF

When all blocking statuses are resolved, click **Generate package**. The downloaded filename is:

```text
T-2026-0417_Package.pdf
```

The cover is English as required by the problem statement. The optional index page is enabled by default. Original pages follow in requirement order and every page gets a readable footer.

## 8. Dark mode and Bangla

Use the top-right controls to switch:

- English ↔ বাংলা
- Light ↔ Night mode

The chosen preferences are stored locally in the browser.

## 9. Contest reminder

This is a practice/reference project. In the real AI DevFest contest, the official Rulebook says all project code must be written during the contest after T+0. Do not copy this source into the actual contest submission.
