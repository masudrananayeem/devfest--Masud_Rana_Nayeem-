# Setup Guide

## 1. Install Node.js

Use a current Node.js LTS release.

Check:

```bash
node -v
npm -v
```

## 2. Install and run

```bash
cd tender-package-builder
npm install
npm run dev
```

Open the Vite URL in Chrome.

## 3. Practice mode

Click **Load practice pack**. The bundled practice data contains the provided `requirements.json` and all supplied sample PDFs.

Then:
1. Review the suggested matches.
2. R01 must use `trade_license_2026.pdf`, not the expired 2025 file.
3. R05 can use either experience certificate, but the identical second file is marked duplicate.
4. Enter R01 expiry `2027-06-30`.
5. Enter R04 expiry `2026-12-31`.
6. R06 and R07 may remain `Not provided` because they are optional.
7. Generate the package.

## 4. Manual contest-style workflow

Import `requirements.json` yourself, upload PDFs, use **Suggest matches**, verify every row, enter expiry dates, fix all blocking statuses, then generate.

## 5. Deploy

```text
Build: npm run build
Output: dist
```

## 6. Rule reminder

The practice ZIP is not contest-submission code. The official rulebook requires starting from zero at T+0, with no pre-existing project code.
