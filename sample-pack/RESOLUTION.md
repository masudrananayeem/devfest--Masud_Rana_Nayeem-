# Sample pack resolution

For `T-2026-0417` (deadline 2026-10-20):

- R01 Trade License → `trade_license_2026.pdf` (valid until 2027-06-30)
- R02 TIN Certificate → `03_tin_certificate.pdf`
- R03 VAT Registration Certificate → `04_vat_certificate.pdf`
- R04 Bank Solvency Certificate → `bank_solvency.pdf` (expiry 2026-12-31)
- R05 Experience Certificate → `experience_cert.pdf` OR `experience_cert (1).pdf`, but not both
- R06 Audited Financial Statement → optional, not provided
- R07 Manufacturer's Authorization → optional, not provided
- R08 Technical Proposal → `02_technical_proposal.pdf`
- R09 Financial Proposal → `01_financial_proposal.pdf`
- R10 Signed Declaration → `scan_0042.pdf`

Problems intentionally present in the sample pack:
1. `trade_license_2025.pdf` is expired.
2. The two experience certificate PDFs have identical content and are duplicates.
3. `scan_0042.pdf` is image-based, so a text extractor may return no text; it is still a valid PDF and can be matched manually.
