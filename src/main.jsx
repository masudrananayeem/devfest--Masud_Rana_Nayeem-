import React, { useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import {
  AlertCircle, CheckCircle2, ChevronRight, CircleHelp, Copy, Download,
  FileCheck2, FileText, FolderOpen, Languages, Link2, Loader2, PackageCheck,
  Plus, RefreshCw, Search, ShieldCheck, Trash2, Upload, XCircle
} from 'lucide-react'
import './styles.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url
).toString()

const MAX_FILES = 30
const MAX_BYTES = 50 * 1024 * 1024
const FOOTER_BAND = 26

const TEXT = {
  en: {
    app: 'Tender Package Builder', subtitle: 'Validate, match and assemble a submission-ready PDF package.',
    practice: 'Practice mode', contest: 'Contest-ready workflow', import: 'Import requirements.json', upload: 'Upload PDFs', loadPractice: 'Load practice pack', reset: 'Reset work', clearFiles: 'Remove all files', generate: 'Generate package', download: 'Download package',
    startTitle: 'Start with the tender requirements', startText: 'Import requirements.json, then add the PDF documents you received.',
    tender: 'Tender', bidder: 'Bidder', entity: 'Procuring entity', deadline: 'Submission deadline', documents: 'Requirements', files: 'Uploaded PDFs', status: 'Status', match: 'Matched file', expiry: 'Expiry date',
    required: 'Required', optional: 'Optional', none: 'Not matched', pages: 'pages', kb: 'KB', remove: 'Remove', preview: 'Preview', search: 'Search files',
    ok: 'OK', missing: 'Missing', expiryNeeded: 'Expiry date needed', expired: 'Expired', notProvided: 'Not provided', duplicate: 'Duplicate content', duplicateOf: 'Duplicate of',
    ready: 'Ready to generate', blocking: 'blocking issue(s)', included: 'Included documents', local: 'All PDF processing stays in your browser. Nothing is uploaded to a backend.',
    workflow: ['Import requirements', 'Upload PDFs', 'Match documents', 'Enter expiry dates', 'Generate package'],
    emptyFiles: 'No PDFs uploaded yet', emptyFilesText: 'You can select up to 30 PDF files, 50 MB total.',
    dropTitle: 'Drop PDF files here', dropText: 'or click to browse. Only PDF files are accepted.',
    invalidJson: 'Invalid requirements.json. Check tender and requirement fields.', invalidPdf: 'Only PDF files are accepted.', tooMany: `Maximum ${MAX_FILES} PDF files.`, tooLarge: 'Total PDF size cannot exceed 50 MB.', badPdf: 'Could not read this PDF. It may be damaged or password-protected.',
    duplicateBlocked: 'This PDF has the same content as another uploaded PDF. The duplicate cannot be matched to a different requirement.',
    packageSuccess: 'Package generated successfully.', packageFail: 'Package generation failed. Check the PDFs and try again.',
    confirmReset: 'Clear matches and expiry dates? Uploaded PDFs will stay.', confirmClear: 'Remove all uploaded PDFs and matches?',
    autoMatch: 'Suggest matches', clearMatches: 'Clear matches', selectAll: 'Select PDFs',
    issues: 'Issues', allGood: 'All required documents are valid.', generated: 'Generated package',
    practiceHint: 'Practice pack is bundled only for rehearsal. Do not submit this pre-built project in the real contest; recreate code after T+0.',
    sampleLoaded: 'Practice pack loaded. Review every match and enter expiry dates before generating.',
    noBackend: 'Frontend-only • browser processing • no Firebase/Supabase/backend',
    language: 'Language',
    step: 'Step',
    fileCount: 'files',
    created: 'Created',
    cover: 'Cover page',
    packageInfo: 'Package will include only matched files, sorted by requirement order.',
    choose: 'Choose PDF',
    close: 'Close',
  },
  bn: {
    app: 'টেন্ডার প্যাকেজ বিল্ডার', subtitle: 'ডকুমেন্ট যাচাই, ম্যাচ এবং সাবমিশন-রেডি PDF প্যাকেজ তৈরি করুন।',
    practice: 'প্র্যাকটিস মোড', contest: 'কনটেস্ট-রেডি workflow', import: 'requirements.json ইমপোর্ট', upload: 'PDF আপলোড', loadPractice: 'প্র্যাকটিস প্যাক লোড', reset: 'কাজ রিসেট', clearFiles: 'সব ফাইল মুছুন', generate: 'প্যাকেজ তৈরি', download: 'প্যাকেজ ডাউনলোড',
    startTitle: 'টেন্ডারের requirements দিয়ে শুরু করুন', startText: 'প্রথমে requirements.json ইমপোর্ট করুন, তারপর পাওয়া PDF ডকুমেন্ট যোগ করুন।',
    tender: 'টেন্ডার', bidder: 'বিডার', entity: 'প্রকিউরিং প্রতিষ্ঠান', deadline: 'সাবমিশন ডেডলাইন', documents: 'প্রয়োজনীয় ডকুমেন্ট', files: 'আপলোড করা PDF', status: 'স্ট্যাটাস', match: 'ম্যাচ করা ফাইল', expiry: 'মেয়াদ শেষের তারিখ',
    required: 'বাধ্যতামূলক', optional: 'ঐচ্ছিক', none: 'ম্যাচ করা হয়নি', pages: 'পৃষ্ঠা', kb: 'KB', remove: 'মুছুন', preview: 'দেখুন', search: 'ফাইল খুঁজুন',
    ok: 'ঠিক আছে', missing: 'অনুপস্থিত', expiryNeeded: 'মেয়াদ প্রয়োজন', expired: 'মেয়াদ শেষ', notProvided: 'দেওয়া হয়নি', duplicate: 'একই কনটেন্ট', duplicateOf: 'ডুপ্লিকেট',
    ready: 'প্যাকেজ তৈরির জন্য প্রস্তুত', blocking: 'টি সমস্যা প্যাকেজ আটকে দিচ্ছে', included: 'অন্তর্ভুক্ত ডকুমেন্ট', local: 'সব PDF processing browser-এর মধ্যেই হয়। কোনো backend-এ ফাইল আপলোড হয় না।',
    workflow: ['Requirements ইমপোর্ট', 'PDF আপলোড', 'ডকুমেন্ট ম্যাচ', 'Expiry date দিন', 'প্যাকেজ তৈরি'],
    emptyFiles: 'এখনও কোনো PDF নেই', emptyFilesText: 'সর্বোচ্চ ৩০টি PDF, মোট ৫০ MB পর্যন্ত।',
    dropTitle: 'এখানে PDF ফাইল ছেড়ে দিন', dropText: 'অথবা browse করুন। শুধু PDF গ্রহণ করা হবে।',
    invalidJson: 'requirements.json সঠিক নয়। tender ও requirement fields পরীক্ষা করুন।', invalidPdf: 'শুধু PDF ফাইল গ্রহণ করা হয়।', tooMany: `সর্বোচ্চ ${MAX_FILES}টি PDF।`, tooLarge: 'মোট PDF size ৫০ MB-এর বেশি হতে পারবে না।', badPdf: 'PDF পড়া যায়নি। ফাইলটি damaged বা password-protected হতে পারে।',
    duplicateBlocked: 'এই PDF-এর content অন্য PDF-এর সাথে একই। তাই অন্য requirement-এ duplicate match করা যাবে না।',
    packageSuccess: 'প্যাকেজ সফলভাবে তৈরি হয়েছে।', packageFail: 'প্যাকেজ তৈরি করা যায়নি। PDF ফাইলগুলো পরীক্ষা করে আবার চেষ্টা করুন।',
    confirmReset: 'শুধু matches ও expiry dates reset করবেন? PDF ফাইল থাকবে।', confirmClear: 'সব PDF ও matches মুছে ফেলবেন?',
    autoMatch: 'ম্যাচ সাজেস্ট করুন', clearMatches: 'সব ম্যাচ মুছুন', selectAll: 'PDF বাছাই',
    issues: 'সমস্যা', allGood: 'সব বাধ্যতামূলক ডকুমেন্ট valid।', generated: 'তৈরি করা প্যাকেজ',
    practiceHint: 'এই practice pack শুধু rehearsal-এর জন্য bundled। Real contest-এ T+0-এর আগে এই project code submit করা যাবে না; code নতুন করে তৈরি করতে হবে।',
    sampleLoaded: 'Practice pack loaded। প্রতিটি match review করুন এবং expiry dates দিন।',
    noBackend: 'Frontend-only • browser processing • Firebase/Supabase/backend নেই',
    language: 'ভাষা', step: 'ধাপ', fileCount: 'টি ফাইল', created: 'তৈরি', cover: 'Cover page', packageInfo: 'শুধু matched file-গুলো requirement order অনুযায়ী package-এ যাবে।', choose: 'PDF বাছাই', close: 'বন্ধ',
  }
}

const t = (lang, key) => TEXT[lang][key] ?? key

function validateRequirements(data) {
  if (!data || typeof data !== 'object' || !data.tender || !Array.isArray(data.requirements)) throw new Error('shape')
  const tender = data.tender
  const dateRe = /^\d{4}-\d{2}-\d{2}$/
  if (!tender.tender_id || !tender.title || !tender.procuring_entity || !tender.bidder || !dateRe.test(tender.submission_deadline)) throw new Error('shape')
  const seen = new Set()
  const reqs = [...data.requirements].sort((a, b) => Number(a.order) - Number(b.order))
  if (!reqs.length) throw new Error('shape')
  for (const r of reqs) {
    if (!r.id || seen.has(r.id) || !Number.isInteger(r.order) || !r.title_en || !r.title_bn || typeof r.mandatory !== 'boolean' || typeof r.has_expiry !== 'boolean') throw new Error('shape')
    seen.add(r.id)
  }
  return { tender, requirements: reqs }
}

async function sha256(file) {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
}

async function inspectPdf(file) {
  const bytes = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise
  return { bytes, pages: pdf.numPages }
}

function makeId(hash, name) { return `${hash.slice(0, 16)}-${name}-${crypto.randomUUID()}` }

function StatusBadge({ status, lang }) {
  const map = {
    ok: [t(lang, 'ok'), 'ok', CheckCircle2], missing: [t(lang, 'missing'), 'missing', XCircle],
    expiryNeeded: [t(lang, 'expiryNeeded'), 'warning', AlertCircle], expired: [t(lang, 'expired'), 'missing', XCircle],
    notProvided: [t(lang, 'notProvided'), 'neutral', CircleHelp]
  }
  const [label, cls, Icon] = map[status]
  return <span className={`status ${cls}`}><Icon size={14} />{label}</span>
}

function App() {
  const [lang, setLang] = useState('en')
  const [data, setData] = useState(null)
  const [files, setFiles] = useState([])
  const [matches, setMatches] = useState({})
  const [expiries, setExpiries] = useState({})
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [search, setSearch] = useState('')
  const [generated, setGenerated] = useState(null)
  const [dragging, setDragging] = useState(false)
  const reqInput = useRef(null)
  const pdfInput = useRef(null)

  const fileById = useMemo(() => Object.fromEntries(files.map(f => [f.id, f])), [files])
  const reqById = useMemo(() => Object.fromEntries((data?.requirements || []).map(r => [r.id, r])), [data])
  const hashGroups = useMemo(() => {
    const groups = {}
    for (const f of files) (groups[f.hash] ||= []).push(f)
    return groups
  }, [files])
  const duplicateHashes = useMemo(() => new Set(Object.entries(hashGroups).filter(([, group]) => group.length > 1).map(([hash]) => hash)), [hashGroups])

  const statuses = useMemo(() => {
    const result = {}
    if (!data) return result
    for (const r of data.requirements) {
      const file = fileById[matches[r.id]]
      if (!file) { result[r.id] = r.mandatory ? 'missing' : 'notProvided'; continue }
      if (r.has_expiry) {
        const expiry = expiries[r.id]
        if (!expiry) result[r.id] = 'expiryNeeded'
        else result[r.id] = expiry < data.tender.submission_deadline ? 'expired' : 'ok'
      } else result[r.id] = 'ok'
    }
    return result
  }, [data, fileById, matches, expiries])

  const blocking = Object.values(statuses).filter(s => ['missing', 'expiryNeeded', 'expired'].includes(s)).length
  const ready = !!data && blocking === 0
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  function notify(type, text) {
    setMessage({ type, text })
    window.clearTimeout(notify.timer)
    notify.timer = window.setTimeout(() => setMessage(null), 4500)
  }

  async function importRequirements(file, { silent = false } = {}) {
    try {
      const parsed = JSON.parse(await file.text())
      const normalized = validateRequirements(parsed)
      setData(normalized)
      setMatches({})
      setExpiries({})
      setGenerated(null)
      if (!silent) notify('success', `${normalized.tender.tender_id} loaded.`)
      return true
    } catch {
      notify('error', t(lang, 'invalidJson')); return false
    }
  }

  async function addFiles(fileList, { silent = false } = {}) {
    const incoming = [...fileList]
    if (!incoming.length) return
    if (files.length + incoming.length > MAX_FILES) { notify('error', t(lang, 'tooMany')); return }
    const existingHashes = new Set(files.map(f => f.hash))
    const results = []
    let total = files.reduce((s, f) => s + f.size, 0)
    setBusy(true)
    try {
      for (const file of incoming) {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { notify('error', `${file.name}: ${t(lang, 'invalidPdf')}`); continue }
        if (total + file.size > MAX_BYTES) { notify('error', t(lang, 'tooLarge')); break }
        try {
          const { bytes, pages } = await inspectPdf(file)
          const hash = await sha256(file)
          const item = { id: makeId(hash, file.name), name: file.name, size: file.size, pages, hash, bytes }
          results.push(item)
          total += file.size
          existingHashes.add(hash)
        } catch { notify('error', `${file.name}: ${t(lang, 'badPdf')}`) }
      }
      if (results.length) setFiles(prev => [...prev, ...results])
      if (!silent && results.length) notify('success', `${results.length} PDF${results.length > 1 ? 's' : ''} added.`)
    } finally { setBusy(false) }
  }

  async function loadPracticePack() {
    setBusy(true)
    try {
      const reqRes = await fetch('/sample-pack/requirements.json')
      if (!reqRes.ok) throw new Error('requirements')
      const reqFile = new File([await reqRes.blob()], 'requirements.json', { type: 'application/json' })
      const ok = await importRequirements(reqFile, { silent: true })
      if (!ok) return
      const names = [
        '01_financial_proposal.pdf', '02_technical_proposal.pdf', '03_tin_certificate.pdf', '04_vat_certificate.pdf',
        'bank_solvency.pdf', 'experience_cert.pdf', 'experience_cert (1).pdf', 'scan_0042.pdf', 'trade_license_2025.pdf', 'trade_license_2026.pdf'
      ]
      const loaded = []
      for (const name of names) {
        const res = await fetch(`/sample-pack/documents/${encodeURIComponent(name)}`)
        if (!res.ok) throw new Error(name)
        const blob = await res.blob()
        loaded.push(new File([blob], name, { type: 'application/pdf' }))
      }
      await addFiles(loaded, { silent: true })
      window.setTimeout(() => autoMatch(true), 50)
      notify('success', t(lang, 'sampleLoaded'))
    } catch (e) {
      console.error(e); notify('error', 'Practice pack could not be loaded.')
    } finally { setBusy(false) }
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id))
    setMatches(prev => Object.fromEntries(Object.entries(prev).filter(([, fid]) => fid !== id)))
    setGenerated(null)
  }

  function assign(reqId, fileId) {
    if (!fileId) {
      setMatches(prev => { const next = { ...prev }; delete next[reqId]; return next })
      setGenerated(null); return
    }
    const file = fileById[fileId]
    const sameContent = hashGroups[file.hash] || []
    const alreadyUsed = Object.entries(matches).find(([rid, fid]) => rid !== reqId && sameContent.some(f => f.id === fid))
    if (alreadyUsed) { notify('error', t(lang, 'duplicateBlocked')); return }
    setMatches(prev => {
      const next = { ...prev }
      for (const [rid, fid] of Object.entries(next)) if (rid !== reqId && fid === fileId) delete next[rid]
      next[reqId] = fileId
      return next
    })
    setGenerated(null)
  }

  function autoMatch(silent = false) {
    if (!data || !files.length) return
    const current = { ...matches }
    const used = new Set(Object.values(current))
    const score = (r, f) => {
      const n = f.name.toLowerCase()
      const title = `${r.title_en} ${r.title_bn}`.toLowerCase()
      let s = 0
      const keywords = {
        'r01': ['trade', 'license'], 'r02': ['tin'], 'r03': ['vat'], 'r04': ['bank', 'solvency'], 'r05': ['experience', 'exp'],
        'r06': ['financial', 'audited'], 'r07': ['manufacturer', 'authorization'], 'r08': ['technical'], 'r09': ['financial'], 'r10': ['scan', 'declaration', 'signed']
      }[r.id.toLowerCase()] || title.split(/\W+/).filter(x => x.length > 3)
      for (const k of keywords) if (n.includes(k)) s += 10
      if (r.id === 'R01' && n.includes('2026')) s += 8
      if (r.id === 'R01' && n.includes('2025')) s -= 5
      if (n.includes('proposal') && title.includes('proposal')) s += 4
      return s
    }
    const ordered = [...data.requirements].sort((a, b) => Number(b.mandatory) - Number(a.mandatory) || a.order - b.order)
    const usedHashes = new Set()
    for (const r of ordered) {
      if (current[r.id]) { const existing = fileById[current[r.id]]; if (existing) usedHashes.add(existing.hash); continue }
      const candidates = files
        .filter(f => !used.has(f.id) && !usedHashes.has(f.hash))
        .map(f => ({ f, s: score(r, f) }))
        .filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s)
      if (candidates[0]) { current[r.id] = candidates[0].f.id; used.add(candidates[0].f.id); usedHashes.add(candidates[0].f.hash) }
    }
    setMatches(current); setGenerated(null)
    if (!silent) notify('success', 'Suggested matches added. Review them before generating.')
  }

  function resetWork() {
    if (!window.confirm(t(lang, 'confirmReset'))) return
    setMatches({}); setExpiries({}); setGenerated(null)
  }

  function clearEverything() {
    if (!window.confirm(t(lang, 'confirmClear'))) return
    setFiles([]); setMatches({}); setExpiries({}); setGenerated(null)
  }

  function previewFile(file) {
    const url = URL.createObjectURL(new Blob([file.bytes], { type: 'application/pdf' }))
    window.open(url, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => URL.revokeObjectURL(url), 60000)
  }

  async function generatePackage() {
    if (!ready || !data || busy) return
    setBusy(true); setGenerated(null)
    try {
      const included = data.requirements.map(r => ({ r, f: fileById[matches[r.id]] })).filter(x => x.f)
      const totalPages = 1 + included.reduce((sum, x) => sum + x.f.pages, 0)
      const out = await PDFDocument.create()
      const regular = await out.embedFont(StandardFonts.Helvetica)
      const bold = await out.embedFont(StandardFonts.HelveticaBold)
      const W = 595.28, H = 841.89, margin = 46
      const navy = rgb(0.05, 0.19, 0.27), muted = rgb(0.38, 0.44, 0.50), accent = rgb(0.05, 0.50, 0.65)
      const cover = out.addPage([W, H])
      cover.drawRectangle({ x: 0, y: H - 132, width: W, height: 132, color: navy })
      cover.drawText('TENDER DOCUMENT PACKAGE', { x: margin, y: H - 52, size: 18, font: bold, color: rgb(1, 1, 1) })
      cover.drawText(data.tender.tender_id, { x: margin, y: H - 77, size: 10, font: bold, color: rgb(0.55, 0.86, 0.92) })
      cover.drawText(data.tender.title, { x: margin, y: H - 105, size: 14, font: bold, color: rgb(1, 1, 1) })
      let y = H - 170
      const details = [
        ['Procuring entity', data.tender.procuring_entity], ['Bidder', data.tender.bidder], ['Submission deadline', data.tender.submission_deadline], ['Package created', new Date().toISOString().slice(0, 10)]
      ]
      for (const [label, value] of details) {
        cover.drawText(label, { x: margin, y, size: 9, font: bold, color: muted })
        cover.drawText(value, { x: margin + 125, y, size: 10, font: regular, color: rgb(0.10, 0.13, 0.17) })
        y -= 22
      }
      y -= 10
      cover.drawText('Included documents', { x: margin, y, size: 12, font: bold, color: navy }); y -= 23
      const columns = included.length > 14 ? 2 : 1
      const rowsPerCol = Math.ceil(included.length / columns)
      for (let i = 0; i < included.length; i++) {
        const col = Math.floor(i / rowsPerCol), row = i % rowsPerCol
        const itemY = y - row * 18
        const itemX = margin + col * 255
        cover.drawText(`${i + 1}. ${included[i].r.title_en}`, { x: itemX, y: itemY, size: 8.5, font: regular, color: rgb(0.15, 0.20, 0.25) })
      }
      const footer = (pageNo) => `${data.tender.tender_id} | Page ${pageNo} of ${totalPages}`
      cover.drawLine({ start: { x: margin, y: 39 }, end: { x: W - margin, y: 39 }, thickness: 0.5, color: rgb(0.82, 0.85, 0.88) })
      cover.drawText(footer(1), { x: margin, y: 24, size: 8, font: regular, color: muted })

      let pageNo = 1
      for (const item of included) {
        const src = await PDFDocument.load(item.f.bytes, { ignoreEncryption: false })
        for (const srcPage of src.getPages()) {
          const srcW = srcPage.getWidth(), srcH = srcPage.getHeight()
          const page = out.addPage([srcW, srcH])
          const embedded = await out.embedPage(srcPage)
          const scale = Math.min(srcW / srcW, Math.max(0.1, (srcH - FOOTER_BAND) / srcH))
          const drawW = srcW * scale, drawH = srcH * scale
          const x = (srcW - drawW) / 2, yPos = FOOTER_BAND + (srcH - FOOTER_BAND - drawH) / 2
          page.drawPage(embedded, { x, y: yPos, width: drawW, height: drawH })
          page.drawRectangle({ x: 0, y: 0, width: srcW, height: FOOTER_BAND, color: rgb(1, 1, 1), opacity: 0.98 })
          page.drawLine({ start: { x: 28, y: FOOTER_BAND - 1 }, end: { x: srcW - 28, y: FOOTER_BAND - 1 }, thickness: 0.4, color: rgb(0.82, 0.85, 0.88) })
          pageNo += 1
          page.drawText(footer(pageNo), { x: 28, y: 8, size: 7.5, font: regular, color: muted })
        }
      }
      const bytes = await out.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const name = `${data.tender.tender_id}_Package.pdf`
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click()
      setGenerated({ url, name, pages: totalPages, count: included.length })
      notify('success', t(lang, 'packageSuccess'))
    } catch (error) {
      console.error(error); notify('error', t(lang, 'packageFail'))
    } finally { setBusy(false) }
  }

  const onDrop = async (e) => { e.preventDefault(); setDragging(false); if (!data) return; await addFiles(e.dataTransfer.files) }

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="brand-icon"><PackageCheck size={22}/></div><div><strong>{t(lang, 'app')}</strong><span>{t(lang, 'subtitle')}</span></div></div>
      <div className="top-actions"><span className="mode-pill">{t(lang, 'practice')}</span><button className="language" onClick={() => setLang(v => v === 'en' ? 'bn' : 'en')}><Languages size={16}/>{lang === 'en' ? 'বাংলা' : 'English'}</button></div>
    </header>

    <main className="container">
      <section className="hero">
        <div><div className="eyebrow">AI DEVFEST • FRONTEND ONLY</div><h1>{t(lang, 'app')}</h1><p>{t(lang, 'subtitle')}</p><div className="hero-badges"><span><ShieldCheck size={14}/> {t(lang, 'noBackend')}</span></div></div>
        <div className="hero-actions">
          <button className="btn ghost" onClick={loadPracticePack} disabled={busy}><PackageCheck size={17}/>{t(lang, 'loadPractice')}</button>
          <button className="btn light" onClick={() => reqInput.current?.click()} disabled={busy}><FolderOpen size={17}/>{t(lang, 'import')}</button>
          <button className="btn primary" onClick={() => pdfInput.current?.click()} disabled={!data || busy}><Upload size={17}/>{t(lang, 'upload')}</button>
          <input ref={reqInput} hidden type="file" accept="application/json,.json" onChange={e => e.target.files?.[0] && importRequirements(e.target.files[0])}/>
          <input ref={pdfInput} hidden type="file" accept="application/pdf,.pdf" multiple onChange={e => e.target.files?.length && addFiles(e.target.files)}/>
        </div>
      </section>

      <div className="practice-note"><CircleHelp size={16}/><span>{t(lang, 'practiceHint')}</span></div>

      <nav className="workflow">{TEXT[lang].workflow.map((label, i) => <div className={`workflow-item ${data && i === 0 ? 'done' : ''}`} key={label}><span>{i + 1}</span><b>{label}</b><ChevronRight size={15}/></div>)}</nav>

      {!data ? <section className="start-card">
        <div className="start-icon"><FileCheck2 size={30}/></div><h2>{t(lang, 'startTitle')}</h2><p>{t(lang, 'startText')}</p>
        <div className="start-actions"><button className="btn primary large" onClick={() => reqInput.current?.click()}><FolderOpen size={18}/>{t(lang, 'import')}</button><button className="btn secondary large" onClick={loadPracticePack} disabled={busy}>{busy ? <Loader2 className="spin" size={18}/> : <PackageCheck size={18}/>} {t(lang, 'loadPractice')}</button></div>
        <div className="start-checks"><span>✓ JSON validation</span><span>✓ PDF page counting</span><span>✓ SHA-256 duplicate detection</span><span>✓ Browser-only PDF merge</span></div>
      </section> : <>
        <section className="tender-strip">
          <div><small>{t(lang, 'tender')}</small><strong>{data.tender.tender_id}</strong><span>{data.tender.title}</span></div>
          <div><small>{t(lang, 'entity')}</small><strong>{data.tender.procuring_entity}</strong><span>{data.tender.bidder}</span></div>
          <div><small>{t(lang, 'deadline')}</small><strong>{data.tender.submission_deadline}</strong><span>{data.requirements.length} {t(lang, 'documents').toLowerCase()}</span></div>
          <button className="btn secondary" onClick={() => reqInput.current?.click()}><RefreshCw size={15}/> {t(lang, 'import')}</button>
        </section>

        {message && <div className={`toast ${message.type}`}><AlertCircle size={16}/><span>{message.text}</span><button onClick={() => setMessage(null)}><XCircle size={15}/></button></div>}

        <section className="toolbar">
          <div className="toolbar-left"><button className="btn secondary small" onClick={() => autoMatch()} disabled={!files.length || busy}><Search size={15}/>{t(lang, 'autoMatch')}</button><button className="btn secondary small" onClick={resetWork}><RefreshCw size={15}/>{t(lang, 'reset')}</button></div>
          <div className={`readiness ${ready ? 'ready' : 'blocked'}`}>{ready ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>} {ready ? t(lang, 'allGood') : `${blocking} ${t(lang, 'blocking')}`}</div>
        </section>

        <section className="content-grid">
          <div className="panel checklist">
            <div className="panel-head"><div><h2>{t(lang, 'documents')}</h2><p>{t(lang, 'packageInfo')}</p></div><span className="count-pill">{data.requirements.length}</span></div>
            <div className="checklist-list">
              {data.requirements.map((r, idx) => {
                const status = statuses[r.id], matched = fileById[matches[r.id]]
                const usedElsewhere = new Set(Object.entries(matches).filter(([rid]) => rid !== r.id).map(([, fid]) => fid))
                const options = files.filter(f => !usedElsewhere.has(f.id) || f.id === matches[r.id])
                return <div className="requirement" key={r.id}>
                  <div className="req-number">{String(idx + 1).padStart(2, '0')}</div>
                  <div className="req-copy"><div className="req-title-line"><strong>{lang === 'bn' ? r.title_bn : r.title_en}</strong><StatusBadge status={status} lang={lang}/></div><div className="req-tags"><code>{r.id}</code><span className={r.mandatory ? 'tag required' : 'tag optional'}>{r.mandatory ? t(lang, 'required') : t(lang, 'optional')}</span>{r.has_expiry && <span className="tag expiry">{t(lang, 'expiry')}</span>}</div></div>
                  <div className="req-controls"><select value={matches[r.id] || ''} onChange={e => assign(r.id, e.target.value)}><option value="">{t(lang, 'none')}</option>{options.map(f => <option key={f.id} value={f.id}>{f.name}{duplicateHashes.has(f.hash) ? ` • ${t(lang, 'duplicate')}` : ''}</option>)}</select>{matched && r.has_expiry && <input type="date" value={expiries[r.id] || ''} onChange={e => { setExpiries(prev => ({ ...prev, [r.id]: e.target.value })); setGenerated(null) }} />}</div>
                </div>
              })}
            </div>
          </div>

          <aside className="panel file-panel" onDragOver={e => { e.preventDefault(); if (data) setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
            <div className="panel-head"><div><h2>{t(lang, 'files')}</h2><p>{files.length}/{MAX_FILES} • {(files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(2)} MB</p></div><button className="icon-btn" onClick={() => pdfInput.current?.click()} disabled={busy}><Plus size={18}/></button></div>
            <div className="file-tools"><div className="search-box"><Search size={14}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t(lang, 'search')}/></div><button className="text-btn" onClick={clearEverything} disabled={!files.length}>{t(lang, 'clearFiles')}</button></div>
            {dragging && <div className="drop-overlay"><Upload size={30}/><strong>{t(lang, 'dropTitle')}</strong><span>{t(lang, 'dropText')}</span></div>}
            {!files.length ? <div className="empty-files"><Upload size={28}/><strong>{t(lang, 'emptyFiles')}</strong><span>{t(lang, 'emptyFilesText')}</span><button className="btn secondary small" onClick={() => pdfInput.current?.click()}>{t(lang, 'choose')}</button></div> : <div className="files-list">{filteredFiles.map(file => {
              const duplicate = duplicateHashes.has(file.hash), matchedRid = Object.entries(matches).find(([, fid]) => fid === file.id)?.[0]
              return <div className={`file-item ${duplicate ? 'duplicate' : ''}`} key={file.id}><div className="file-symbol"><FileText size={17}/></div><div className="file-info"><strong title={file.name}>{file.name}</strong><span>{file.pages} {t(lang, 'pages')} • {(file.size / 1024).toFixed(0)} {t(lang, 'kb')}</span>{duplicate && <em><Copy size={12}/> {t(lang, 'duplicate')}</em>}{matchedRid && <small><Link2 size={11}/> {lang === 'bn' ? reqById[matchedRid]?.title_bn : reqById[matchedRid]?.title_en}</small>}</div><button className="mini-btn" title={t(lang, 'preview')} onClick={() => previewFile(file)}><FileText size={14}/></button><button className="mini-btn danger" title={t(lang, 'remove')} onClick={() => removeFile(file.id)}><Trash2 size={14}/></button></div>
            })}</div>}
          </aside>
        </section>

        <section className="bottom-bar"><div><strong>{ready ? t(lang, 'ready') : `${blocking} ${t(lang, 'blocking')}`}</strong><span>{t(lang, 'local')}</span></div><div className="bottom-actions"><button className="btn secondary" onClick={resetWork}><RefreshCw size={16}/>{t(lang, 'reset')}</button><button className="btn primary large" disabled={!ready || busy} onClick={generatePackage}>{busy ? <Loader2 className="spin" size={17}/> : <Download size={17}/>} {t(lang, 'generate')}</button></div></section>

        {generated && <section className="generated"><CheckCircle2 size={22}/><div><strong>{t(lang, 'generated')}</strong><span>{generated.name} • {generated.pages} pages • {generated.count} documents</span></div><a className="btn secondary" href={generated.url} download={generated.name}><Download size={16}/>{t(lang, 'download')}</a></section>}
      </>}
    </main>
    <footer>{t(lang, 'local')} • AI DevFest</footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
