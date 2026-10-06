# Setup Guide

## 1. Install Node.js

Use a current LTS Node.js release.

Check:

```bash
node -v
npm -v
```

## 2. Extract the ZIP

Open a terminal in the project folder.

```bash
cd tender-package-builder
```

## 3. Install dependencies

```bash
npm install
```

## 4. Start development server

```bash
npm run dev
```

Open the URL shown by Vite.

## 5. Practice with the supplied pack

Import:

```text
sample-pack/requirements.json
```

Then select all PDFs inside:

```text
sample-pack/documents/
```

Use the matching plan in README.md.

## 6. Generate

The Generate button becomes enabled only when every mandatory requirement is non-blocking.

The generated file downloads as:

```text
T-2026-0417_Package.pdf
```

## 7. Production build

```bash
npm run build
```

Output:

```text
dist/
```

## 8. Cloudflare Pages / Vercel

Build command:

```text
npm run build
```

Output directory:

```text
dist
```

No backend or environment variables are required.

## Important contest rule

This package is a practice/reference implementation. The official rulebook requires all project code to be created during the contest after T+0. If you are competing, recreate the project during the permitted contest window rather than submitting this pre-created code.
