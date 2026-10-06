import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import {
  AlertCircle, CheckCircle2, ChevronDown, CircleHelp, FileCheck2, FileText,
  FolderOpen, Languages, Link2, PackageCheck, Plus, RefreshCw, Trash2,
  Upload, XCircle, Download, ShieldCheck, Copy, Search
} from 'lucide-react'
import './styles.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

const MAX_FILES = 30
const MAX_BYTES = 50 * 1024 * 1024

const I18N = {
  en: {
    appTitle: 'Tender Package Builder',
    subtitle: 'Check, match and assemble a submission-ready PDF package',
    importReq: 'Import requirements.json',
    uploadPdf: 'Upload PDF files',
    reset: 'Reset',
    generate: 'Generate package',
    noReq: 'Import a requirements.json file to begin.',
    tender: 'Tender',
    deadline: 'Submission deadline',
    bidder: 'Bidder',
    entity: 'Procuring entity',
    requirements: 'Required documents',
    files: 'Uploaded files',
    match: 'Match',
    unmatch: 'Unmatch',
    expiry: 'Expiry date',
    chooseFile: 'Choose PDF',
    none: 'Not matched',
    pages: 'pages',
    status: 'Status',
    remove: 'Remove',
    duplicate: 'Duplicate content',
    noMatch: 'No match',
    ok: 'OK',
    missing: 'Missing',
    expiryNeeded: 'Expiry date needed',
    expired: 'Expired',
    notProvided: 'Not provided',
    start: 'Start here',
    required: 'Required',
    optional: 'Optional',
    matched: 'matched',
    blocking: 'blocking issue(s)',
    ready: 'Ready to generate',
    packageReady: 'Package generated successfully.',
    invalidJson: 'Invalid requirements.json',
    invalidPdf: 'Only PDF files are accepted.',
    tooMany: `Maximum ${MAX_FILES} PDF files.`,
    tooLarge: 'The total upload size cannot exceed 50 MB.',
    badPdf: 'Could not read this PDF. It may be damaged or password-protected.',
    duplicateCannot: 'This file has identical content to another uploaded file and cannot be matched separately.',
    language: 'Language',
    instructions: 'Workflow',
    step1: '1. Import requirements.json',
    step2: '2. Upload all PDFs',
    step3: '3. Match each file to a requirement',
    step4: '4. Enter expiry dates where required',
    step5: '5. Fix blocking statuses, then generate',
    included: 'Included documents',
    noRoute: 'No',
    footerHint: 'All processing happens in your browser. Files are not uploaded to a server.',
    generated: 'Download package',
    clear: 'Clear all',
    confirmClear: 'Clear the current work?',
    invalidReqShape: 'The requirements file is missing required fields or contains inconsistent data.',
    duplicateDetected: 'Duplicate content detected',
    sampleLoad: 'Load sample pack',
    search: 'Search',
    page: 'Page',
    of: 'of',
    created: 'Package created',
    problems: 'Problems',
    viewOnly: 'Practice pack'
  },
  bn: {
    appTitle: 'টেন্ডার প্যাকেজ বিল্ডার',
    subtitle: 'ডকুমেন্ট যাচাই, মিলানো এবং সাবমিশনের জন্য PDF প্যাকেজ তৈরি করুন',
    importReq: 'requirements.json ইমপোর্ট করুন',
    uploadPdf: 'PDF ফাইল আপলোড',
    reset: 'রিসেট',
    generate: 'প্যাকেজ তৈরি',
    noReq: 'শুরু করতে requirements.json ইমপোর্ট করুন।',
    tender: 'টেন্ডার',
    deadline: 'সাবমিশন ডেডলাইন',
    bidder: 'বিডার',
    entity: 'প্রকিউরিং প্রতিষ্ঠান',
    requirements: 'প্রয়োজনীয় ডকুমেন্ট',
    files: 'আপলোড করা ফাইল',
    match: 'ম্যাচ',
    unmatch: 'আনম্যাচ',
    expiry: 'মেয়াদ শেষের তারিখ',
    chooseFile: 'PDF বাছাই করুন',
    none: 'ম্যাচ করা হয়নি',
    pages: 'পৃষ্ঠা',
    status: 'স্ট্যাটাস',
    remove: 'মুছুন',
    duplicate: 'একই কনটেন্ট',
    noMatch: 'ম্যাচ নেই',
    ok: 'ঠিক আছে',
    missing: 'অনুপস্থিত',
    expiryNeeded: 'মেয়াদ প্রয়োজন',
    expired: 'মেয়াদ শেষ',
    notProvided: 'দেওয়া হয়নি',
    start: 'এখান থেকে শুরু করুন',
    required: 'বাধ্যতামূলক',
    optional: 'ঐচ্ছিক',
    matched: 'ম্যাচড',
    blocking: 'টি সমস্যা প্যাকেজ আটকে দিচ্ছে',
    ready: 'প্যাকেজ তৈরির জন্য প্রস্তুত',
    packageReady: 'প্যাকেজ সফলভাবে তৈরি হয়েছে।',
    invalidJson: 'requirements.json সঠিক নয়',
    invalidPdf: 'শুধু PDF ফাইল গ্রহণ করা হয়।',
    tooMany: `সর্বোচ্চ ${MAX_FILES}টি PDF ফাইল দেওয়া যাবে।`,
    tooLarge: 'মোট ফাইলের আকার ৫০ MB-এর বেশি হতে পারবে না।',
    badPdf: 'PDF পড়া যায়নি। ফাইলটি নষ্ট বা password-protected হতে পারে।',
    duplicateCannot: 'এই ফাইলটির কনটেন্ট অন্য একটি ফাইলের সাথে একই, তাই আলাদা ডকুমেন্টে ম্যাচ করা যাবে না।',
    language: 'ভাষা',
    instructions: 'ধাপ',
    step1: '১. requirements.json ইমপোর্ট করুন',
    step2: '২. সব PDF আপলোড করুন',
    step3: '৩. প্রতিটি ফাইলের সাথে ডকুমেন্ট ম্যাচ করুন',
    step4: '৪. প্রয়োজনীয় জায়গায় expiry date দিন',
    step5: '৫. blocking status ঠিক করে প্যাকেজ তৈরি করুন',
    included: 'অন্তর্ভুক্ত ডকুমেন্ট',
    noRoute: 'না',
    footerHint: 'সব processing আপনার browser-এর মধ্যেই হয়। কোনো server-এ ফাইল আপলোড করা হয় না।',
    generated: 'প্যাকেজ ডাউনলোড',
    clear: 'সব মুছুন',
    confirmClear: 'বর্তমান কাজ মুছে ফেলবেন?',
    invalidReqShape: 'requirements ফাইলে প্রয়োজনীয় তথ্য নেই বা data অসঙ্গত।',
    duplicateDetected: 'একই কনটেন্টের duplicate পাওয়া গেছে',
    sampleLoad: 'Sample pack লোড',
    search: 'খুঁজুন',
    page: 'পৃষ্ঠা',
    of: 'এর',
    created: 'প্যাকেজ তৈরি',
    problems: 'সমস্যা',
    viewOnly: 'প্র্যাকটিস প্যাক'
  }
}

function t(lang, key) { return I18N[lang][key] || key }

function normalizeRequirementData(data) {
  if (!data?.tender || !Array.isArray(data.requirements)) throw new Error('shape')
  const tender = data.tender
  if (!tender.tender_id || !tender.title || !tender.procuring_entity || !tender.bidder || !/^\\d{4}-\\d{2}-\\d{2}$/.test(tender.submission_deadline)) throw new Error('shape')
  const seen = new Set()
  const reqs = [...data.requirements].sort((a,b) => Number(a.order) - Number(b.order))
  for (const r of reqs) {
    if (!r.id || seen.has(r.id) || !Number.isInteger(r.order) || !r.title_en || !r.title_bn ||
        typeof r.mandatory !== 'boolean' || typeof r.has_expiry !== 'boolean') throw new Error('shape')
    seen.add(r.id)
  }
  return { tender, requirements: reqs }
}

async function hashFile(file) {
  const buf = await file.arrayBuffer()
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return [...new Uint8Array(hash)].map(x => x.toString(16).padStart(2,'0')).join('')
}

async function inspectPdf(file) {
  const bytes = await file.arrayBuffer()
  const doc = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise
  return { bytes, pages: doc.numPages }
}

function StatusBadge({ status, lang }) {
  const map = {
    ok: ['ok','success',CheckCircle2],
    missing: ['missing','danger',XCircle],
    expiryNeeded: ['expiryNeeded','warning',AlertCircle],
    expired: ['expired','danger',XCircle],
    notProvided: ['notProvided','neutral',CircleHelp]
  }
  const [key, cls, Icon] = map[status]
  return <span className={`status-badge ${cls}`}><Icon size={14}/>{t(lang,key)}</span>
}

function App() {
  const [lang, setLang] = useState('en')
  const [data, setData] = useState(null)
  const [files, setFiles] = useState([])
  const [matches, setMatches] = useState({})
  const [expiries, setExpiries] = useState({})
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState(null)
  const reqInput = useRef(null)
  const pdfInput = useRef(null)

  const duplicateHashes = useMemo(() => {
    const counts = {}
    for (const f of files) counts[f.hash] = (counts[f.hash] || 0) + 1
    return new Set(Object.entries(counts).filter(([,n]) => n > 1).map(([h]) => h))
  }, [files])

  const fileById = useMemo(() => Object.fromEntries(files.map(f => [f.id, f])), [files])
  const requirementById = useMemo(() => Object.fromEntries((data?.requirements || []).map(r => [r.id, r])), [data])

  const statusByReq = useMemo(() => {
    if (!data) return {}
    const result = {}
    for (const r of data.requirements) {
      const fid = matches[r.id]
      if (!fid) {
        result[r.id] = r.mandatory ? 'missing' : 'notProvided'
        continue
      }
      const f = fileById[fid]
      if (!f) {
        result[r.id] = r.mandatory ? 'missing' : 'notProvided'
        continue
      }
      if (r.has_expiry) {
        const d = expiries[r.id]
        if (!d) result[r.id] = 'expiryNeeded'
        else result[r.id] = d < data.tender.submission_deadline ? 'expired' : 'ok'
      } else result[r.id] = 'ok'
    }
    return result
  }, [data, matches, expiries, fileById])

  const blockingCount = Object.values(statusByReq).filter(s => ['missing','expiryNeeded','expired'].includes(s)).length
  const ready = !!data && blockingCount === 0

  function showMessage(type, text) {
    setMessage({ type, text })
    window.setTimeout(() => setMessage(null), 4200)
  }

  async function importRequirements(file) {
    try {
      const parsed = JSON.parse(await file.text())
      const normalized = normalizeRequirementData(parsed)
      setData(normalized)
      setMatches({})
      setExpiries({})
      setGeneratedUrl(null)
      showMessage('success', `${normalized.tender.tender_id} loaded.`)
    } catch {
      showMessage('error', t(lang,'invalidJson'))
    }
  }

  async function uploadPdfs(list) {
    const incoming = [...list]
    if (!incoming.length) return
    if (files.length + incoming.length > MAX_FILES) return showMessage('error', t(lang,'tooMany'))
    const total = files.reduce((s,f)=>s+f.size,0) + incoming.reduce((s,f)=>s+f.size,0)
    if (total > MAX_BYTES) return showMessage('error', t(lang,'tooLarge'))
    const next = []
    for (const file of incoming) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showMessage('error', `${file.name}: ${t(lang,'invalidPdf')}`); continue
      }
      try {
        setBusy(true)
        const { bytes, pages } = await inspectPdf(file)
        const hash = await hashFile(file)
        next.push({
          id: `${hash.slice(0,12)}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: file.name,
          size: file.size,
          pages,
          hash,
          bytes
        })
      } catch {
        showMessage('error', `${file.name}: ${t(lang,'badPdf')}`)
      } finally { setBusy(false) }
    }
    setFiles(prev => [...prev, ...next])
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id))
    setMatches(prev => {
      const copy = {...prev}
      for (const [rid,fid] of Object.entries(copy)) if (fid === id) delete copy[rid]
      return copy
    })
  }

  function assign(reqId, fileId) {
    if (!fileId) {
      setMatches(prev => { const x={...prev}; delete x[reqId]; return x })
      return
    }
    const file = fileById[fileId]
    if (duplicateHashes.has(file.hash)) {
      const same = files.filter(f => f.hash === file.hash)
      // A duplicate content set may have one chosen member, but cannot be matched to different requirements.
      const usedBy = Object.entries(matches).find(([rid,fid]) => same.some(f => f.id === fid) && rid !== reqId)
      if (usedBy) return showMessage('error', t(lang,'duplicateCannot'))
    }
    setMatches(prev => {
      const x = {...prev}
      for (const [rid,fid] of Object.entries(x)) if (fid === fileId && rid !== reqId) delete x[rid]
      x[reqId] = fileId
      return x
    })
  }

  function resetWork() {
    if (!window.confirm(t(lang,'confirmClear'))) return
    setMatches({})
    setExpiries({})
    setGeneratedUrl(null)
    setMessage(null)
  }

  async function generatePackage() {
    if (!ready || !data) return
    setBusy(true)
    try {
      const included = data.requirements
        .map(r => ({ r, f: fileById[matches[r.id]] }))
        .filter(x => x.f)
      const totalPages = 1 + included.reduce((s,x)=>s+x.f.pages,0)
      const out = await PDFDocument.create()
      const helvetica = await out.embedFont(StandardFonts.Helvetica)
      const bold = await out.embedFont(StandardFonts.HelveticaBold)
      const W = 595.28, H = 841.89, margin = 48

      const cover = out.addPage([W,H])
      cover.drawText('TENDER DOCUMENT PACKAGE', { x: margin, y: H-75, size: 19, font: bold, color: rgb(.04,.12,.22) })
      cover.drawText(data.tender.tender_id, { x: margin, y: H-105, size: 11, font: bold, color: rgb(.10,.42,.60) })
      cover.drawText(data.tender.title, { x: margin, y: H-132, size: 16, font: bold })
      const details = [
        ['Procuring entity', data.tender.procuring_entity],
        ['Bidder', data.tender.bidder],
        ['Submission deadline', data.tender.submission_deadline],
        ['Package created', new Date().toISOString().slice(0,10)]
      ]
      let y = H-175
      for (const [label,value] of details) {
        cover.drawText(label, {x:margin,y,size:9,font:bold,color:rgb(.35,.39,.44)})
        cover.drawText(value, {x:margin+125,y,size:10,font:helvetica})
        y -= 23
      }
      y -= 8
      cover.drawText('Included documents', {x:margin,y,size:12,font:bold})
      y -= 24
      for (let i=0;i<included.length;i++) {
        const r = included[i].r
        cover.drawText(`${i+1}. ${r.title_en}`, {x:margin+8,y,size:10,font:helvetica})
        y -= 19
      }
      const footer = (page, total) => `${data.tender.tender_id} | Page ${page} of ${total}`
      cover.drawText(footer(1,totalPages), {x:margin,y:25,size:8,font:helvetica,color:rgb(.35,.39,.44)})

      // Rebuild every source page on a slightly taller page so the footer gets
      // its own bottom band and never covers source document content.
      for (const item of included) {
        const src = await PDFDocument.load(item.f.bytes)
        for (const srcPage of src.getPages()) {
          const embedded = await out.embedPage(srcPage)
          const srcW = srcPage.getWidth()
          const srcH = srcPage.getHeight()
          const band = 28
          const page = out.addPage([srcW, srcH + band])
          page.drawPage(embedded, { x: 0, y: band, width: srcW, height: srcH })
        }
      }
      const all = out.getPages()
      for (let i=1;i<all.length;i++) {
        all[i].drawText(footer(i+1,totalPages), {
          x: margin, y: 9, size: 8, font: helvetica, color: rgb(.35,.39,.44)
        })
      }
      const bytes = await out.save()
      const blob = new Blob([bytes], {type:'application/pdf'})
      const url = URL.createObjectURL(blob)
      setGeneratedUrl(url)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.tender.tender_id}_Package.pdf`
      a.click()
      showMessage('success', t(lang,'packageReady'))
    } catch (e) {
      console.error(e)
      showMessage('error', 'Package generation failed. Please verify the PDFs.')
    } finally { setBusy(false) }
  }

  function loadSamplePack() {
    showMessage('info', 'For contest use, import the provided files manually. This button is only for practice.')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark"><PackageCheck size={22}/></div>
          <div>
            <div className="brand-title">{t(lang,'appTitle')}</div>
            <div className="brand-subtitle">{t(lang,'subtitle')}</div>
          </div>
        </div>
        <div className="top-actions">
          <span className="practice-pill">{t(lang,'viewOnly')}</span>
          <button className="lang-btn" onClick={() => setLang(lang==='en'?'bn':'en')}><Languages size={17}/>{lang==='en'?'বাংলা':'English'}</button>
        </div>
      </header>

      <main className="page">
        <section className="hero-card">
          <div>
            <div className="eyebrow">AI DEVFEST • TENDER WORKFLOW</div>
            <h1>{t(lang,'appTitle')}</h1>
            <p>{t(lang,'subtitle')}</p>
          </div>
          <div className="hero-actions">
            <button className="btn secondary" onClick={() => reqInput.current?.click()}><FolderOpen size={17}/>{t(lang,'importReq')}</button>
            <button className="btn primary" disabled={!data || busy} onClick={() => pdfInput.current?.click()}><Upload size={17}/>{t(lang,'uploadPdf')}</button>
            <input ref={reqInput} type="file" accept=".json,application/json" hidden onChange={e=>e.target.files[0]&&importRequirements(e.target.files[0])}/>
            <input ref={pdfInput} type="file" accept="application/pdf,.pdf" multiple hidden onChange={e=>uploadPdfs(e.target.files)}/>
          </div>
        </section>

        <section className="workflow">
          {[t(lang,'step1'),t(lang,'step2'),t(lang,'step3'),t(lang,'step4'),t(lang,'step5')].map((s,i)=><div className="workflow-step" key={s}><span>{i+1}</span>{s.replace(/^\\d+\\.\\s*/,'').replace(/^[০-৯]+\\.\\s*/,'')}</div>)}
        </section>

        {!data && <section className="empty-state"><FileText size={42}/><h2>{t(lang,'start')}</h2><p>{t(lang,'noReq')}</p><button className="btn primary" onClick={() => reqInput.current?.click()}><FolderOpen size={17}/>{t(lang,'importReq')}</button></section>}

        {data && <React.Fragment>
          <section className="tender-grid">
            <div className="info-card"><span>{t(lang,'tender')}</span><strong>{data.tender.tender_id}</strong><p>{data.tender.title}</p></div>
            <div className="info-card"><span>{t(lang,'entity')}</span><strong>{data.tender.procuring_entity}</strong><p>{t(lang,'bidder')}: {data.tender.bidder}</p></div>
            <div className="info-card"><span>{t(lang,'deadline')}</span><strong>{data.tender.submission_deadline}</strong><p>{data.requirements.length} {t(lang,'requirements').toLowerCase()}</p></div>
          </section>

          {message && <div className={`toast ${message.type}`}><AlertCircle size={17}/>{message.text}<button onClick={()=>setMessage(null)}><XCircle size={16}/></button></div>}

          <section className="main-grid">
            <div className="panel">
              <div className="panel-head">
                <div><h2>{t(lang,'requirements')}</h2><p>{data.requirements.length} items • sorted by order</p></div>
                <div className={`readiness ${ready?'ready':'blocked'}`}>{ready?<CheckCircle2 size={16}/>:<AlertCircle size={16}/>} {ready?t(lang,'ready'):`${blockingCount} ${t(lang,'blocking')}`}</div>
              </div>
              <div className="req-list">
                {data.requirements.map((r,idx)=>{
                  const status=statusByReq[r.id]
                  const matched=fileById[matches[r.id]]
                  const usedIds = new Set(Object.entries(matches).filter(([rid])=>rid!==r.id).map(([,fid])=>fid))
                  const selectable = files.filter(f=>!usedIds.has(f.id) || f.id===matches[r.id])
                  return <div className="req-row" key={r.id}>
                    <div className="order">{String(idx+1).padStart(2,'0')}</div>
                    <div className="req-main">
                      <div className="req-title">{lang==='bn'?r.title_bn:r.title_en}</div>
                      <div className="req-meta"><code>{r.id}</code><span className={r.mandatory?'req-tag':'opt-tag'}>{r.mandatory?t(lang,'required'):t(lang,'optional')}</span>{r.has_expiry&&<span className="expiry-tag">{t(lang,'expiry')}</span>}</div>
                    </div>
                    <div className="req-match">
                      <select value={matches[r.id]||''} onChange={e=>assign(r.id,e.target.value)}>
                        <option value="">{t(lang,'none')}</option>
                        {selectable.map(f=><option key={f.id} value={f.id}>{f.name}{duplicateHashes.has(f.hash)?` • ${t(lang,'duplicate')}`:''}</option>)}
                      </select>
                      {matched && r.has_expiry && <input aria-label={t(lang,'expiry')} type="date" value={expiries[r.id]||''} min="1900-01-01" onChange={e=>setExpiries(x=>({...x,[r.id]:e.target.value}))}/>}
                    </div>
                    <StatusBadge status={status} lang={lang}/>
                  </div>
                })}
              </div>
            </div>

            <aside className="panel files-panel">
              <div className="panel-head">
                <div><h2>{t(lang,'files')}</h2><p>{files.length}/{MAX_FILES} • {Math.round(files.reduce((s,f)=>s+f.size,0)/1024)} KB</p></div>
                <button className="icon-btn" title={t(lang,'uploadPdf')} onClick={()=>pdfInput.current?.click()}><Plus size={18}/></button>
              </div>
              {files.length===0 ? <div className="files-empty"><Upload size={30}/><p>{t(lang,'uploadPdf')}</p><button className="btn secondary small" onClick={()=>pdfInput.current?.click()}>{t(lang,'chooseFile')}</button></div> :
                <div className="file-list">{files.map(f=>{
                  const duplicate=duplicateHashes.has(f.hash)
                  const matchedReq=Object.entries(matches).find(([,fid])=>fid===f.id)?.[0]
                  return <div className={`file-card ${duplicate?'duplicate':''}`} key={f.id}>
                    <div className="file-icon"><FileText size={18}/></div>
                    <div className="file-info"><strong title={f.name}>{f.name}</strong><span>{f.pages} {t(lang,'pages')} • {(f.size/1024).toFixed(0)} KB</span>{duplicate&&<em><Copy size={12}/>{t(lang,'duplicate')}</em>}{matchedReq&&<small><Link2 size={12}/> {requirementById[matchedReq] ? (lang==='bn'?requirementById[matchedReq].title_bn:requirementById[matchedReq].title_en):matchedReq}</small>}</div>
                    <button className="remove-btn" title={t(lang,'remove')} onClick={()=>removeFile(f.id)}><Trash2 size={16}/></button>
                  </div>
                })}</div>}
            </aside>
          </section>

          <section className="action-bar">
            <div>
              <strong>{ready?t(lang,'ready'):`${blockingCount} ${t(lang,'blocking')}`}</strong>
              <span>{t(lang,'footerHint')}</span>
            </div>
            <div className="action-buttons">
              <button className="btn secondary" onClick={resetWork}><RefreshCw size={17}/>{t(lang,'reset')}</button>
              <button className="btn primary large" disabled={!ready || busy} onClick={generatePackage}>{busy?<RefreshCw className="spin" size={17}/>:<Download size={17}/>} {t(lang,'generate')}</button>
            </div>
          </section>

          {generatedUrl && <div className="generated-card"><CheckCircle2 size={20}/><div><strong>{t(lang,'packageReady')}</strong><p>{data.tender.tender_id}_Package.pdf</p></div><a className="btn secondary" href={generatedUrl} download={`${data.tender.tender_id}_Package.pdf`}><Download size={16}/>{t(lang,'generated')}</a></div>}
        </React.Fragment>}
      </main>

      <footer className="footer">{t(lang,'footerHint')} • AI DevFest</footer>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
