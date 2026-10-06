import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import {
  AlertCircle, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  ClipboardCheck, Copy, Download, FileArchive, FileCheck2, FileImage, FileText, FolderOpen,
  Languages, Moon, PackageCheck, Plus, RefreshCw, Search, Settings2, ShieldCheck, Sun,
  Trash2, Upload, X, XCircle, Eye, Save, FileSpreadsheet, Sparkles
} from 'lucide-react'
import './styles.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const MAX_FILES = 30
const MAX_BYTES = 50 * 1024 * 1024
const FOOTER_BAND = 28
const APP_DB = 'tender-package-builder-v3'
const APP_STORE = 'workspace'

const TEXT = {
  en: {
    app:'Tender Package Builder', subtitle:'Check, match and assemble a submission-ready tender package.',
    practice:'Practice mode', contest:'Contest workflow', import:'Import requirements.json', upload:'Upload PDFs', loadPractice:'Load practice pack',
    reset:'Reset work', clearFiles:'Remove all files', generate:'Generate package', download:'Download package',
    startTitle:'Start with your tender requirements', startText:'Load requirements.json first, then add the PDF documents received from the bidder.',
    tender:'Tender', bidder:'Bidder', entity:'Procuring entity', deadline:'Submission deadline', requirements:'Requirements', files:'Uploaded PDFs',
    status:'Status', match:'Matched file', expiry:'Expiry date', required:'Required', optional:'Optional', none:'Not matched', pages:'pages',
    kb:'KB', mb:'MB', remove:'Remove', preview:'Preview', search:'Search files', ok:'OK', missing:'Missing', expiryNeeded:'Expiry date needed',
    expired:'Expired', notProvided:'Not provided', duplicate:'Duplicate content', duplicateOf:'Duplicate of', ready:'Ready to generate',
    blocking:'blocking issue(s)', included:'Included documents', local:'All document processing happens in your browser. No tender file is uploaded to a backend.',
    workflow:['Load requirements','Upload PDFs','Match documents','Check expiry','Generate package'], emptyFiles:'No PDFs uploaded yet',
    emptyFilesText:'Up to 30 PDFs and 50 MB total. Drag and drop is supported.', dropTitle:'Drop PDF files here', dropText:'Only PDF files are accepted.',
    invalidJson:'Invalid requirements.json. Check the tender and requirement fields.', invalidPdf:'Only PDF files are accepted.',
    tooMany:`Maximum ${MAX_FILES} PDF files.`, tooLarge:'Total PDF size cannot exceed 50 MB.', badPdf:'Could not read this PDF. It may be damaged or password-protected.',
    duplicateBlocked:'Duplicate content cannot be used for two different requirements.', packageSuccess:'Package generated successfully.',
    packageFail:'Package generation failed. Check the files and try again.', confirmReset:'Clear matches and expiry dates? Uploaded PDFs will stay.',
    confirmClear:'Remove all uploaded PDFs, matches and expiry dates?', suggest:'Suggest matches', clearMatches:'Clear matches',
    allGood:'All blocking checks passed.', issues:'Issues', generated:'Generated package', language:'Language', theme:'Theme', dark:'Night mode', light:'Light mode', brandAlt:'Tender Package Builder logo', advancedOptions:'Advanced options', hideOptions:'Hide options', optionalPngCover:'Optional PNG for cover', optionalPngSignature:'Optional PNG', examplePages:'e.g. 3,4,5', frontendOnlyBadge:'Frontend only • browser processing', browserPdfBadge:'React + browser PDF engine', jsonValidation:'JSON validation', pageCounting:'PDF page counting', duplicateDetection:'SHA-256 duplicate detection', browserMerge:'Browser-only PDF merge',
    practiceHint:'Practice pack is for rehearsal only. In the real contest, recreate the project from zero after T+0.',
    sampleLoaded:'Practice pack loaded. Review suggested matches and expiry dates before generating.', noBackend:'Frontend-only • browser processing • no backend/database',
    choose:'Choose PDFs', close:'Close', created:'Created', cover:'Cover', packageInfo:'Only matched files are included, in requirement order.',
    index:'Index', indexBonus:'Index page', indexHint:'Optional bonus: add an index page with document start pages.', save:'Save workspace', loadSaved:'Restore workspace',
    exportChecklist:'Export CSV', saved:'Workspace saved in this browser.', restored:'Workspace restored.', noSaved:'No saved workspace found.',
    removeFile:'Remove file', replace:'Replace', clearAll:'Clear all', previewTitle:'PDF preview', closePreview:'Close preview',
    filename:'File name', size:'Size', hash:'Content hash', matchedTo:'Matched to', unassigned:'Unassigned', dragHint:'Drop PDFs anywhere in this panel',
    duplicateWarning:'This file is byte-for-byte identical to another uploaded file.', generatedPages:'pages', documents:'documents',
    logo:'Logo / seal', addLogo:'Add PNG logo', logoLoaded:'Logo loaded', removeLogo:'Remove logo', signature:'Signature / seal bonus',
    addSignature:'Add PNG image', signaturePages:'Place on pages', allPages:'All pages', selectedPages:'Selected pages', pageNumbers:'Page numbers',
    languageCover:'Cover language', englishRequired:'The official cover page is English. Bangla remains available throughout the app.',
    step:'Step', browserOnly:'Browser only', validate:'Validate', passed:'Passed', failed:'Failed',
    requirementsReady:'Requirements loaded', filesReady:'PDFs ready', matchesReady:'Matches reviewed', expiryReady:'Expiry checked', packageReady:'Package ready',
    removeMatch:'Remove match', selectFile:'Select a PDF', noMatch:'No file selected', autoMatched:'Suggested matches applied. Please review them.',
    invalidFileType:'Rejected: this is not a PDF.', duplicateMatch:'That duplicate content is already matched to another requirement.',
    exportDone:'Checklist exported.', resetDone:'Work reset.', clearDone:'All files removed.',
  },
  bn: {
    app:'টেন্ডার প্যাকেজ বিল্ডার', subtitle:'ডকুমেন্ট যাচাই, ম্যাচ এবং সাবমিশন-রেডি টেন্ডার প্যাকেজ তৈরি করুন।',
    practice:'প্র্যাকটিস মোড', contest:'কনটেস্ট workflow', import:'requirements.json ইমপোর্ট', upload:'PDF আপলোড', loadPractice:'প্র্যাকটিস প্যাক লোড',
    reset:'কাজ রিসেট', clearFiles:'সব ফাইল মুছুন', generate:'প্যাকেজ তৈরি', download:'প্যাকেজ ডাউনলোড',
    startTitle:'টেন্ডারের requirements দিয়ে শুরু করুন', startText:'প্রথমে requirements.json লোড করুন, তারপর পাওয়া PDF ডকুমেন্ট যোগ করুন।',
    tender:'টেন্ডার', bidder:'বিডার', entity:'প্রকিউরিং প্রতিষ্ঠান', deadline:'সাবমিশন ডেডলাইন', requirements:'প্রয়োজনীয় ডকুমেন্ট', files:'আপলোড করা PDF',
    status:'স্ট্যাটাস', match:'ম্যাচ করা ফাইল', expiry:'মেয়াদ শেষের তারিখ', required:'বাধ্যতামূলক', optional:'ঐচ্ছিক', none:'ম্যাচ করা হয়নি', pages:'পৃষ্ঠা',
    kb:'KB', mb:'MB', remove:'মুছুন', preview:'দেখুন', search:'ফাইল খুঁজুন', ok:'ঠিক আছে', missing:'অনুপস্থিত', expiryNeeded:'মেয়াদ প্রয়োজন',
    expired:'মেয়াদ শেষ', notProvided:'দেওয়া হয়নি', duplicate:'ডুপ্লিকেট কনটেন্ট', duplicateOf:'ডুপ্লিকেট', ready:'প্যাকেজ তৈরির জন্য প্রস্তুত',
    blocking:'টি সমস্যা প্যাকেজ আটকে দিচ্ছে', included:'অন্তর্ভুক্ত ডকুমেন্ট', local:'সব ডকুমেন্ট processing browser-এর মধ্যেই হয়। কোনো tender file backend-এ যায় না।',
    workflow:['Requirements লোড','PDF আপলোড','ডকুমেন্ট ম্যাচ','Expiry যাচাই','প্যাকেজ তৈরি'], emptyFiles:'এখনও কোনো PDF নেই',
    emptyFilesText:'সর্বোচ্চ ৩০টি PDF এবং মোট ৫০ MB। Drag & drop করা যাবে।', dropTitle:'এখানে PDF ফাইল ছেড়ে দিন', dropText:'শুধু PDF গ্রহণ করা হবে।',
    invalidJson:'requirements.json সঠিক নয়। tender ও requirement fields পরীক্ষা করুন।', invalidPdf:'শুধু PDF গ্রহণ করা হয়.',
    tooMany:`সর্বোচ্চ ${MAX_FILES}টি PDF।`, tooLarge:'মোট PDF size ৫০ MB-এর বেশি হতে পারবে না।', badPdf:'PDF পড়া যায়নি। ফাইলটি damaged বা password-protected হতে পারে।',
    duplicateBlocked:'একই content-এর duplicate দুইটি আলাদা requirement-এ ব্যবহার করা যাবে না।', packageSuccess:'প্যাকেজ সফলভাবে তৈরি হয়েছে।',
    packageFail:'প্যাকেজ তৈরি করা যায়নি। ফাইলগুলো পরীক্ষা করে আবার চেষ্টা করুন।', confirmReset:'Matches ও expiry dates reset করবেন? PDF থাকবে।',
    confirmClear:'সব PDF, matches ও expiry dates মুছে ফেলবেন?', suggest:'ম্যাচ সাজেস্ট করুন', clearMatches:'সব ম্যাচ মুছুন',
    allGood:'সব blocking check পাস করেছে।', issues:'সমস্যা', generated:'তৈরি করা প্যাকেজ', language:'ভাষা', theme:'থিম', dark:'নাইট মোড', light:'লাইট মোড', brandAlt:'টেন্ডার প্যাকেজ বিল্ডার লোগো', advancedOptions:'Advanced options', hideOptions:'Hide options', optionalPngCover:'কভারের জন্য ঐচ্ছিক PNG', optionalPngSignature:'ঐচ্ছিক PNG', examplePages:'যেমন ৩,৪,৫', frontendOnlyBadge:'Frontend only • browser processing', browserPdfBadge:'React + browser PDF engine', jsonValidation:'JSON validation', pageCounting:'PDF page counting', duplicateDetection:'SHA-256 duplicate detection', browserMerge:'Browser-only PDF merge',
    practiceHint:'এই practice pack শুধু rehearsal-এর জন্য। Real contest-এ T+0-এর পরে project নতুন করে zero থেকে তৈরি করতে হবে।',
    sampleLoaded:'Practice pack loaded। Suggested match ও expiry dates review করে তারপর generate করুন।', noBackend:'Frontend-only • browser processing • backend/database নেই',
    choose:'PDF বাছাই', close:'বন্ধ', created:'তৈরি', cover:'কভার', packageInfo:'শুধু matched file-গুলো requirement order অনুযায়ী package-এ যাবে।',
    index:'ইনডেক্স', indexBonus:'ইনডেক্স পেজ', indexHint:'Optional bonus: প্রতিটি document কোন page থেকে শুরু হয়েছে দেখাবে।', save:'Workspace save', loadSaved:'Saved workspace খুলুন',
    exportChecklist:'CSV export', saved:'এই browser-এ workspace save হয়েছে।', restored:'Workspace restore হয়েছে।', noSaved:'কোনো saved workspace পাওয়া যায়নি।',
    removeFile:'ফাইল মুছুন', replace:'Replace', clearAll:'সব মুছুন', previewTitle:'PDF preview', closePreview:'Preview বন্ধ',
    filename:'ফাইলের নাম', size:'সাইজ', hash:'Content hash', matchedTo:'ম্যাচ হয়েছে', unassigned:'ম্যাচ করা হয়নি', dragHint:'এই panel-এ যেকোনো জায়গায় PDF drop করুন',
    duplicateWarning:'এই file-এর content অন্য uploaded file-এর সাথে হুবহু একই।', generatedPages:'পৃষ্ঠা', documents:'ডকুমেন্ট',
    logo:'Logo / seal', addLogo:'PNG logo যোগ করুন', logoLoaded:'Logo loaded', removeLogo:'Logo মুছুন', signature:'Signature / seal bonus',
    addSignature:'PNG image যোগ করুন', signaturePages:'কোন page-এ বসবে', allPages:'সব page', selectedPages:'Selected pages', pageNumbers:'Page numbers',
    languageCover:'Cover language', englishRequired:'Official cover page English হতে হবে। পুরো app Bangla/English switch করা যাবে।',
    step:'ধাপ', browserOnly:'Browser only', validate:'যাচাই', passed:'পাস', failed:'ব্যর্থ',
    requirementsReady:'Requirements loaded', filesReady:'PDF ready', matchesReady:'Matches reviewed', expiryReady:'Expiry checked', packageReady:'Package ready',
    removeMatch:'Match সরান', selectFile:'PDF নির্বাচন করুন', noMatch:'কোনো file selected নয়', autoMatched:'Suggested matches বসানো হয়েছে। Review করুন।',
    invalidFileType:'Reject হয়েছে: এটি PDF নয়।', duplicateMatch:'এই duplicate content ইতিমধ্যে অন্য requirement-এ matched।',
    exportDone:'Checklist export হয়েছে।', resetDone:'Work reset হয়েছে।', clearDone:'সব file মুছে ফেলা হয়েছে।',
  }
}
const tr = (lang, key) => TEXT[lang][key] ?? key

function validateRequirements(data) {
  if (!data || typeof data !== 'object' || !data.tender || !Array.isArray(data.requirements)) throw new Error('shape')
  const tender = data.tender
  const dateRe = /^\d{4}-\d{2}-\d{2}$/
  if (!tender.tender_id || !tender.title || !tender.procuring_entity || !tender.bidder || !dateRe.test(tender.submission_deadline)) throw new Error('shape')
  const seen = new Set()
  const reqs = [...data.requirements].sort((a,b)=>Number(a.order)-Number(b.order))
  if (!reqs.length) throw new Error('shape')
  for (const r of reqs) {
    if (!r.id || seen.has(r.id) || !Number.isInteger(r.order) || !r.title_en || !r.title_bn || typeof r.mandatory !== 'boolean' || typeof r.has_expiry !== 'boolean') throw new Error('shape')
    seen.add(r.id)
  }
  return { tender, requirements:reqs }
}

async function sha256Bytes(fileOrBlob) {
  const buffer = await fileOrBlob.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')
}
async function inspectPdf(file) {
  const bytes = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise
  return { bytes, pages: pdf.numPages }
}
function makeId() { return crypto.randomUUID() }
function formatBytes(n) { return n < 1024*1024 ? `${(n/1024).toFixed(0)} KB` : `${(n/1024/1024).toFixed(2)} MB` }
function titleFor(r, lang) { return lang === 'bn' ? r.title_bn : r.title_en }
function dateCompare(a,b) { return a && b ? a.localeCompare(b) : 0 }

function StatusBadge({status,lang}) {
  const map = {
    ok:[tr(lang,'ok'),'ok',CheckCircle2], missing:[tr(lang,'missing'),'missing',XCircle], expiryNeeded:[tr(lang,'expiryNeeded'),'warning',AlertCircle], expired:[tr(lang,'expired'),'missing',XCircle], notProvided:[tr(lang,'notProvided'),'neutral',CircleHelp]
  }
  const [label,cls,Icon]=map[status]
  return <span className={`status ${cls}`}><Icon size={14}/>{label}</span>
}

async function loadPracticeAssets() {
  const base = '/sample-pack/'
  const reqRes = await fetch(`${base}requirements.json`)
  if (!reqRes.ok) throw new Error('practice')
  const req = await reqRes.json()
  const names = [
    '01_financial_proposal.pdf','02_technical_proposal.pdf','03_tin_certificate.pdf','04_vat_certificate.pdf',
    'bank_solvency.pdf','experience_cert.pdf','experience_cert (1).pdf','scan_0042.pdf','trade_license_2025.pdf','trade_license_2026.pdf'
  ]
  const logoRes = await fetch(`${base}documents/company_logo.png`)
  const logoBlob = logoRes.ok ? await logoRes.blob() : null
  const logoUrl = logoBlob ? URL.createObjectURL(logoBlob) : null
  const files=[]
  for (const name of names) {
    const res=await fetch(`${base}documents/${encodeURIComponent(name)}`)
    if (!res.ok) continue
    const blob=await res.blob()
    files.push(new File([blob],name,{type:'application/pdf'}))
  }
  return {req,files,logoBlob,logoUrl}
}

function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem('tpb-lang')||'en')
  const [dark,setDark]=useState(()=>localStorage.getItem('tpb-theme')==='dark')
  const [data,setData]=useState(null)
  const [files,setFiles]=useState([])
  const [matches,setMatches]=useState({})
  const [expiries,setExpiries]=useState({})
  const [search,setSearch]=useState('')
  const [message,setMessage]=useState(null)
  const [busy,setBusy]=useState(false)
  const [dragging,setDragging]=useState(false)
  const [generated,setGenerated]=useState(null)
  const [preview,setPreview]=useState(null)
  const [showAdvanced,setShowAdvanced]=useState(false)
  const [showIndex,setShowIndex]=useState(true)
  const [logo,setLogo]=useState(null)
  const [signature,setSignature]=useState(null)
  const [signaturePages,setSignaturePages]=useState('all')
  const [signatureSelected,setSignatureSelected]=useState([])
  const [workspaceAvailable,setWorkspaceAvailable]=useState(false)
  const reqInput=useRef(null), pdfInput=useRef(null), logoInput=useRef(null), signatureInput=useRef(null)

  useEffect(()=>{ localStorage.setItem('tpb-lang',lang) },[lang])
  useEffect(()=>{ localStorage.setItem('tpb-theme',dark?'dark':'light') },[dark])
  useEffect(()=>{ checkSaved() },[])

  const fileById=useMemo(()=>Object.fromEntries(files.map(f=>[f.id,f])),[files])
  const reqById=useMemo(()=>Object.fromEntries((data?.requirements||[]).map(r=>[r.id,r])),[data])
  const hashGroups=useMemo(()=>{const g={}; files.forEach(f=>(g[f.hash]??=[]).push(f)); return g},[files])
  const duplicateHashes=useMemo(()=>new Set(Object.entries(hashGroups).filter(([,v])=>v.length>1).map(([k])=>k)),[hashGroups])
  const matchedFileIds=useMemo(()=>new Set(Object.values(matches).filter(Boolean)),[matches])

  const statuses=useMemo(()=>{
    const result={}; if(!data) return result
    for(const r of data.requirements){
      const file=fileById[matches[r.id]]
      if(!file){ result[r.id]=r.mandatory?'missing':'notProvided'; continue }
      if(r.has_expiry){
        const exp=expiries[r.id]
        if(!exp) result[r.id]='expiryNeeded'
        else result[r.id]=dateCompare(exp,data.tender.submission_deadline)<0?'expired':'ok'
      } else result[r.id]='ok'
    }
    return result
  },[data,fileById,matches,expiries])
  const blocking=Object.values(statuses).filter(s=>['missing','expiryNeeded','expired'].includes(s)).length
  const ready=!!data && blocking===0
  const filteredFiles=files.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()))
  const included=data?data.requirements.map(r=>({r,file:fileById[matches[r.id]]})).filter(x=>x.file):[]

  function notify(type,text){setMessage({type,text}); window.clearTimeout(window.__tpbToast); window.__tpbToast=window.setTimeout(()=>setMessage(null),4200)}

  async function importRequirements(file){
    try{
      const parsed=validateRequirements(JSON.parse(await file.text()))
      setData(parsed); setMatches({}); setExpiries({}); setGenerated(null)
      notify('success',`${tr(lang,'requirementsReady')}: ${parsed.requirements.length}`)
    }catch{notify('error',tr(lang,'invalidJson'))}
  }

  async function addFiles(fileList){
    if(!data) return
    const incoming=[...fileList]
    const currentBytes=files.reduce((s,f)=>s+f.size,0)
    if(files.length+incoming.length>MAX_FILES){notify('error',tr(lang,'tooMany'));return}
    const accepted=[]
    for(const raw of incoming){
      if(raw.type!=='application/pdf' && !raw.name.toLowerCase().endsWith('.pdf')){notify('error',`${raw.name}: ${tr(lang,'invalidFileType')}`);continue}
      if(currentBytes+accepted.reduce((s,f)=>s+f.size,0)+raw.size>MAX_BYTES){notify('error',tr(lang,'tooLarge'));break}
      try{
        const {bytes,pages}=await inspectPdf(raw)
        const hash=await sha256Bytes(raw)
        accepted.push({id:makeId(),name:raw.name,size:raw.size,type:'application/pdf',pages,hash,bytes})
      }catch(e){console.error(e);notify('error',`${raw.name}: ${tr(lang,'badPdf')}`)}
    }
    if(accepted.length){setFiles(prev=>[...prev,...accepted]);setGenerated(null);notify('success',`${accepted.length} PDF${accepted.length>1?'s':''} ${lang==='bn'?'যোগ হয়েছে':'added'}.`)}
  }

  function assign(reqId,fileId){
    if(fileId){
      const f=fileById[fileId]
      const duplicateGroup=hashGroups[f.hash]||[]
      const otherMatched=duplicateGroup.some(x=>x.id!==fileId && matchedFileIds.has(x.id))
      const existingReq=Object.entries(matches).find(([rid,fid])=>fid===fileId && rid!==reqId)
      if(existingReq){notify('error',tr(lang,'duplicateMatch'));return}
      if(otherMatched){notify('error',tr(lang,'duplicateMatch'));return}
    }
    setMatches(prev=>({...prev,[reqId]:fileId||undefined}))
    if(!fileId) setExpiries(prev=>{const next={...prev};delete next[reqId];return next})
    setGenerated(null)
  }
  function removeFile(id){
    setFiles(prev=>prev.filter(f=>f.id!==id)); setMatches(prev=>Object.fromEntries(Object.entries(prev).filter(([,fid])=>fid!==id))); setGenerated(null)
  }
  function resetWork(){if(confirm(tr(lang,'confirmReset'))){setMatches({});setExpiries({});setGenerated(null);notify('info',tr(lang,'resetDone'))}}
  function clearEverything(){if(confirm(tr(lang,'confirmClear'))){setFiles([]);setMatches({});setExpiries({});setGenerated(null);notify('info',tr(lang,'clearDone'))}}
  function clearMatches(){setMatches({});setExpiries({});setGenerated(null)}

  function scoreMatch(file,req){
    const name=file.name.toLowerCase().replace(/[^a-z0-9]+/g,' ')
    const tokens=(req.title_en+' '+req.id).toLowerCase().replace(/[^a-z0-9]+/g,' ').split(' ').filter(x=>x.length>2)
    let score=0
    for(const token of tokens) if(name.includes(token)) score+=3
    const aliases={
      'trade license':['trade','license'], 'tin certificate':['tin','taxpayer'], 'vat registration certificate':['vat','registration'],
      'bank solvency certificate':['bank','solvency'], 'experience certificate':['experience','contract'], 'technical proposal':['technical','proposal'],
      'financial proposal':['financial','proposal'], 'signed declaration':['declaration','signed']
    }
    const key=req.title_en.toLowerCase()
    for(const a of aliases[key]||[]) if(name.includes(a)) score+=2
    return score
  }
  function autoMatch(){
    const usedHashes=new Set()
    const next={...matches}
    for(const r of data.requirements){
      if(next[r.id]) { const f=fileById[next[r.id]]; if(f) usedHashes.add(f.hash); continue }
      const candidates=files.filter(f=>!usedHashes.has(f.hash)&&!Object.values(next).includes(f.id)).map(f=>({f,score:scoreMatch(f,r)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score)
      if(candidates[0]){next[r.id]=candidates[0].f.id;usedHashes.add(candidates[0].f.hash)}
    }
    setMatches(next);setGenerated(null);notify('success',tr(lang,'autoMatched'))
  }

  async function loadPracticePack(){
    setBusy(true)
    try{
      const {req,files:practiceFiles,logoBlob,logoUrl}=await loadPracticeAssets()
      const parsed=validateRequirements(req); setData(parsed); setMatches({}); setExpiries({}); setGenerated(null)
      const accepted=[]
      for(const raw of practiceFiles){const {bytes,pages}=await inspectPdf(raw);const hash=await sha256Bytes(raw);accepted.push({id:makeId(),name:raw.name,size:raw.size,type:'application/pdf',pages,hash,bytes})}
      setFiles(accepted); if(logoUrl) setLogo({blob:logoBlob,url:logoUrl,name:'company_logo.png'})
      const byName=Object.fromEntries(accepted.map(f=>[f.name,f]))
      const suggested={
        R01:byName['trade_license_2026.pdf']?.id,
        R02:byName['03_tin_certificate.pdf']?.id,
        R03:byName['04_vat_certificate.pdf']?.id,
        R04:byName['bank_solvency.pdf']?.id,
        R05:byName['experience_cert.pdf']?.id,
        R08:byName['02_technical_proposal.pdf']?.id,
        R09:byName['01_financial_proposal.pdf']?.id,
        R10:byName['scan_0042.pdf']?.id
      }
      setMatches(Object.fromEntries(Object.entries(suggested).filter(([,id])=>id)))
      setExpiries({R01:'2027-06-30',R04:'2026-12-31'})
      notify('success',tr(lang,'sampleLoaded'))
    }catch(e){console.error(e);notify('error',tr(lang,'badPdf'))} finally{setBusy(false)}
  }

  async function previewFile(file){
    try{const url=URL.createObjectURL(new Blob([file.bytes],{type:'application/pdf'}));setPreview({file,url})}catch{notify('error',tr(lang,'badPdf'))}
  }

  async function handleLogo(e){const file=e.target.files?.[0]; if(!file)return; if(file.type!=='image/png'){notify('error',lang==='bn'?'শুধু PNG গ্রহণ করা হয়।':'Only PNG files are accepted.');return}; const url=URL.createObjectURL(file);setLogo({blob:file,url,name:file.name})}
  async function handleSignature(e){const file=e.target.files?.[0];if(!file)return;if(file.type!=='image/png'){notify('error',lang==='bn'?'শুধু PNG গ্রহণ করা হয়।':'Only PNG files are accepted.');return};const url=URL.createObjectURL(file);setSignature({blob:file,url,name:file.name})}

  async function buildCover(out,totalPages,included,regular,bold){
    const page=out.addPage([612,792]);
    page.drawRectangle({x:0,y:0,width:612,height:792,color:rgb(0.96,0.98,0.99)})
    page.drawRectangle({x:0,y:700,width:612,height:92,color:rgb(0.05,0.33,0.42)})
    if(logo){try{const imgBytes=await logo.blob.arrayBuffer();const img=await out.embedPng(imgBytes);page.drawImage(img,{x:40,y:710,width:58,height:58})}catch{}}
    page.drawText('TENDER DOCUMENT PACKAGE',{x:118,y:748,size:19,font:bold,color:rgb(1,1,1)})
    page.drawText('Submission-ready document checklist',{x:118,y:726,size:9.5,font:regular,color:rgb(0.78,0.9,0.93)})
    const items=[['Tender ID',data.tender.tender_id],['Tender title',data.tender.title],['Procuring entity',data.tender.procuring_entity],['Bidder',data.tender.bidder],['Submission deadline',data.tender.submission_deadline],['Package created',new Date().toISOString().slice(0,10)]]
    let y=664
    for(const [label,value] of items){page.drawText(label.toUpperCase(),{x:48,y,size:7,font:bold,color:rgb(0.4,0.47,0.52)});page.drawText(String(value),{x:48,y:y-17,size:12,font:regular,color:rgb(0.1,0.16,0.21)});y-=58}
    page.drawText('INCLUDED DOCUMENTS',{x:48,y:330,size:9,font:bold,color:rgb(0.05,0.33,0.42)})
    const colY=[306,306]; const colX=[52,318]
    included.forEach(({r,file},i)=>{const col=i<15?0:1;const row=i%15;const yy=colY[col]-row*17;page.drawText(`${i+1}. ${r.title_en}`,{x:colX[col],y:yy,size:8.2,font:regular,color:rgb(0.15,0.2,0.25)});page.drawText(`${file.name.slice(0,32)}${file.name.length>32?'…':''}`,{x:colX[col],y:yy-9,size:6.8,font:regular,color:rgb(0.45,0.5,0.54)})})
    page.drawLine({start:{x:48,y:52},end:{x:564,y:52},thickness:0.6,color:rgb(0.78,0.83,0.86)})
    page.drawText(`${data.tender.tender_id} | Page 1 of ${totalPages}`,{x:48,y:34,size:8,font:regular,color:rgb(0.38,0.44,0.49)})
    return page
  }

  async function generatePackage(){
    if(!ready||busy)return
    setBusy(true)
    try{
      const out=await PDFDocument.create(); const regular=await out.embedFont(StandardFonts.Helvetica); const bold=await out.embedFont(StandardFonts.HelveticaBold)
      const includedPages=included.reduce((s,x)=>s+x.file.pages,0)
      const indexPages=showIndex?1:0
      const totalPages=1+indexPages+includedPages
      await buildCover(out,totalPages,included,regular,bold)
      const startMap=[]; let currentPage=2+indexPages
      for(const x of included){startMap.push({r:x.r,file:x.file,start:currentPage});currentPage+=x.file.pages}
      if(showIndex){
        const p=out.addPage([612,792]); p.drawText('DOCUMENT INDEX',{x:48,y:742,size:18,font:bold,color:rgb(0.05,0.33,0.42)}); p.drawText(`${data.tender.tender_id} • ${data.tender.title}`,{x:48,y:720,size:9,font:regular,color:rgb(0.42,0.48,0.52)}); let y=680
        startMap.forEach((x,i)=>{const col=i<15?0:1;const row=i%15;const xx=col?318:52;const yy=680-row*32;p.drawText(`${i+1}. ${x.r.title_en}`,{x:xx,y:yy,size:9,font:regular,color:rgb(0.14,0.2,0.25)});p.drawText(`Page ${x.start}`,{x:xx,y:yy-13,size:8,font:bold,color:rgb(0.05,0.33,0.42)});p.drawLine({start:{x:xx,y:yy-17},end:{x:xx+230,y:yy-17},thickness:.4,color:rgb(.86,.88,.9)})})
        p.drawText(`${data.tender.tender_id} | Page 2 of ${totalPages}`,{x:48,y:34,size:8,font:regular,color:rgb(.38,.44,.49)})
      }
      for(const x of included){
        const src=await PDFDocument.load(x.file.bytes); const copied=await out.copyPages(src,src.getPageIndices())
        for(const original of copied){
          const w=original.getWidth(),h=original.getHeight()
          const page=out.addPage([w,h])
          const embedded=await out.embedPage(original)
          const scale=Math.min(1,(h-FOOTER_BAND)/h)
          const drawW=w*scale, drawH=h*scale
          page.drawPage(embedded,{x:(w-drawW)/2,y:FOOTER_BAND,width:drawW,height:drawH})
          page.drawRectangle({x:0,y:0,width:w,height:FOOTER_BAND,color:rgb(1,1,1)})
          page.drawLine({start:{x:0,y:FOOTER_BAND},end:{x:w,y:FOOTER_BAND},thickness:.5,color:rgb(.78,.81,.84)})
          page.drawText(`${data.tender.tender_id} | Page ${out.getPages().length} of ${totalPages}`,{x:24,y:9,size:8,font:regular,color:rgb(.32,.38,.42)})
          if(signature && (signaturePages==='all'||signatureSelected.includes(out.getPages().length))){
            try{
              const sig=await out.embedPng(await signature.blob.arrayBuffer())
              page.drawImage(sig,{x:w-90,y:FOOTER_BAND+12,width:60,height:60})
            }catch{}
          }
        }
      }
      const bytes=await out.save();const blob=new Blob([bytes],{type:'application/pdf'});const url=URL.createObjectURL(blob);const name=`${data.tender.tender_id}_Package.pdf`;const a=document.createElement('a');a.href=url;a.download=name;a.click();setGenerated({url,name,pages:totalPages,count:included.length});notify('success',tr(lang,'packageSuccess'))
    }catch(e){console.error(e);notify('error',`${tr(lang,'packageFail')} ${e?.message||''}`)}finally{setBusy(false)}
  }

  async function saveWorkspace(){
    try{
      const db=await openDb();const tx=db.transaction(APP_STORE,'readwrite');const store=tx.objectStore(APP_STORE)
      await new Promise((resolve,reject)=>{const req=store.put({id:'current',data:{data,matches,expiries,files:files.map(f=>({id:f.id,name:f.name,size:f.size,type:f.type,pages:f.pages,hash:f.hash,bytes:f.bytes})),showIndex,logo:logo?{blob:logo.blob,name:logo.name}:null,signature:signature?{blob:signature.blob,name:signature.name}:null,signaturePages,signatureSelected}});req.onsuccess=resolve;req.onerror=reject})
      setWorkspaceAvailable(true);notify('success',tr(lang,'saved'))
    }catch(e){console.error(e);notify('error','Could not save workspace.')}
  }
  async function restoreWorkspace(){
    try{const db=await openDb();const tx=db.transaction(APP_STORE,'readonly');const record=await new Promise((resolve,reject)=>{const req=tx.objectStore(APP_STORE).get('current');req.onsuccess=()=>resolve(req.result);req.onerror=reject});if(!record){notify('info',tr(lang,'noSaved'));return};setData(record.data.data);setMatches(record.data.matches||{});setExpiries(record.data.expiries||{});setFiles(record.data.files||[]);setShowIndex(record.data.showIndex!==false);setSignaturePages(record.data.signaturePages||'all');setSignatureSelected(record.data.signatureSelected||[]);if(record.data.logo?.blob)setLogo({blob:record.data.logo.blob,url:URL.createObjectURL(record.data.logo.blob),name:record.data.logo.name||'logo.png'});if(record.data.signature?.blob)setSignature({blob:record.data.signature.blob,url:URL.createObjectURL(record.data.signature.blob),name:record.data.signature.name||'signature.png'});setWorkspaceAvailable(true);notify('success',tr(lang,'restored'))}catch(e){console.error(e);notify('error',tr(lang,'noSaved'))}
  }
  async function checkSaved(){try{const db=await openDb();const tx=db.transaction(APP_STORE,'readonly');const r=await new Promise((res,rej)=>{const q=tx.objectStore(APP_STORE).get('current');q.onsuccess=()=>res(q.result);q.onerror=rej});setWorkspaceAvailable(!!r)}catch{}}
  function exportCsv(){
    const rows=[['Requirement','File name','Pages','Expiry date','Status']];data.requirements.forEach(r=>rows.push([r.title_en,matches[r.id]?fileById[matches[r.id]]?.name||'':'',matches[r.id]?fileById[matches[r.id]]?.pages||'':'',expiries[r.id]||'',statuses[r.id]]));
    const csv=rows.map(row=>row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`${data.tender.tender_id}_Checklist.csv`;a.click();URL.revokeObjectURL(url);notify('success',tr(lang,'exportDone'))
  }

  return <div className={`app ${dark?'theme-dark':''}`}>
    <header className="topbar"><div className="brand"><div className="brand-logo"><img src="/app-logo.svg" alt={tr(lang,'brandAlt')}/></div><div><strong>{tr(lang,'app')}</strong><span>{tr(lang,'subtitle')}</span></div></div><div className="top-actions"><span className="mode-pill"><ShieldCheck size={13}/>{tr(lang,'practice')}</span><button className="top-btn" onClick={()=>setDark(v=>!v)} title={tr(lang,'theme')}>{dark?<Sun size={16}/>:<Moon size={16}/>}<span>{dark?tr(lang,'light'):tr(lang,'dark')}</span></button><button className="top-btn" onClick={()=>setLang(v=>v==='en'?'bn':'en')}><Languages size={16}/>{lang==='en'?'বাংলা':'English'}</button></div></header>
    <main className="container">
      <section className="hero"><div className="hero-copy"><div className="eyebrow">AI DEVFEST • FRONTEND ONLY</div><h1>{tr(lang,'app')}</h1><p>{tr(lang,'subtitle')}</p><div className="hero-badges"><span><ShieldCheck size={14}/>{tr(lang,'frontendOnlyBadge')}</span><span><Sparkles size={14}/>{tr(lang,'browserPdfBadge')}</span></div></div><div className="hero-actions"><button className="btn ghost" onClick={loadPracticePack} disabled={busy}>{busy?<RefreshCw className="spin" size={17}/>:<PackageCheck size={17}/>} {tr(lang,'loadPractice')}</button><button className="btn light" onClick={()=>reqInput.current?.click()} disabled={busy}><FolderOpen size={17}/>{tr(lang,'import')}</button><button className="btn primary" onClick={()=>pdfInput.current?.click()} disabled={!data||busy}><Upload size={17}/>{tr(lang,'upload')}</button><input ref={reqInput} hidden type="file" accept="application/json,.json" onChange={e=>e.target.files?.[0]&&importRequirements(e.target.files[0])}/><input ref={pdfInput} hidden type="file" accept="application/pdf,.pdf" multiple onChange={e=>e.target.files?.length&&addFiles(e.target.files)}/></div></section>
      <div className="practice-note"><CircleHelp size={16}/><span>{tr(lang,'practiceHint')}</span></div>
      <nav className="workflow">{TEXT[lang].workflow.map((label,i)=><div className={`workflow-item ${((i===0&&data)||(i===1&&files.length)||(i===2&&Object.keys(matches).length)||(i===3&&data&&data.requirements.every(r=>!r.has_expiry||!matches[r.id]||expiries[r.id]))||(i===4&&ready))?'done':''}`} key={label}><span>{i+1}</span><b>{label}</b><ChevronRight size={15}/></div>)}</nav>
      {!data ? <section className="start-card"><div className="start-icon"><FileArchive size={30}/></div><h2>{tr(lang,'startTitle')}</h2><p>{tr(lang,'startText')}</p><div className="start-actions"><button className="btn primary large" onClick={()=>reqInput.current?.click()}><FolderOpen size={18}/>{tr(lang,'import')}</button><button className="btn secondary large" onClick={loadPracticePack} disabled={busy}><PackageCheck size={18}/>{tr(lang,'loadPractice')}</button>{workspaceAvailable&&<button className="btn secondary large" onClick={restoreWorkspace}><Save size={18}/>{tr(lang,'loadSaved')}</button>}</div><div className="start-checks"><span>✓ {tr(lang,'jsonValidation')}</span><span>✓ {tr(lang,'pageCounting')}</span><span>✓ {tr(lang,'duplicateDetection')}</span><span>✓ {tr(lang,'browserMerge')}</span></div></section> : <>
        <section className="tender-strip"><div><small>{tr(lang,'tender')}</small><strong>{data.tender.tender_id}</strong><span>{data.tender.title}</span></div><div><small>{tr(lang,'entity')}</small><strong>{data.tender.procuring_entity}</strong><span>{data.tender.bidder}</span></div><div><small>{tr(lang,'deadline')}</small><strong>{data.tender.submission_deadline}</strong><span>{data.requirements.length} {tr(lang,'requirements').toLowerCase()}</span></div><div className="strip-logo">{logo&&<img src={logo.url} alt=""/>}</div><div className="strip-actions"><button className="btn secondary small" onClick={saveWorkspace}><Save size={14}/>{tr(lang,'save')}</button>{workspaceAvailable&&<button className="btn secondary small" onClick={restoreWorkspace}><RefreshCw size={14}/>{tr(lang,'loadSaved')}</button>}</div></section>
        {message&&<div className={`toast ${message.type}`}><AlertCircle size={16}/><span>{message.text}</span><button onClick={()=>setMessage(null)}><X size={15}/></button></div>}
        <section className="toolbar"><div className="toolbar-left"><button className="btn secondary small" onClick={autoMatch} disabled={!files.length||busy}><Sparkles size={15}/>{tr(lang,'suggest')}</button><button className="btn secondary small" onClick={clearMatches} disabled={!Object.keys(matches).length}><RefreshCw size={15}/>{tr(lang,'clearMatches')}</button><button className="btn secondary small" onClick={()=>setShowAdvanced(v=>!v)}><Settings2 size={15}/>{showAdvanced?tr(lang,'hideOptions'):tr(lang,'advancedOptions')}</button><button className="btn secondary small" onClick={exportCsv}><FileSpreadsheet size={15}/>{tr(lang,'exportChecklist')}</button></div><div className={`readiness ${ready?'ready':'blocked'}`}>{ready?<CheckCircle2 size={16}/>:<AlertCircle size={16}/>} {ready?tr(lang,'allGood'):`${blocking} ${tr(lang,'blocking')}`}</div></section>
        {showAdvanced&&<section className="advanced panel"><div className="advanced-grid"><label className="switch-row"><input type="checkbox" checked={showIndex} onChange={e=>setShowIndex(e.target.checked)}/><span><b>{tr(lang,'indexBonus')}</b><small>{tr(lang,'indexHint')}</small></span></label><div className="bonus-card"><div className="bonus-head"><div><b>{tr(lang,'logo')}</b><small>{logo?tr(lang,'logoLoaded'):tr(lang,'optionalPngCover')}</small></div><div className="bonus-actions"><button className="btn secondary small" onClick={()=>logoInput.current?.click()}><FileImage size={14}/>{tr(lang,'addLogo')}</button>{logo&&<button className="icon-btn" onClick={()=>setLogo(null)}><Trash2 size={15}/></button>}</div></div>{logo&&<img className="logo-preview" src={logo.url}/>}</div><div className="bonus-card"><div className="bonus-head"><div><b>{tr(lang,'signature')}</b><small>{signature?signature.name:tr(lang,'optionalPngSignature')}</small></div><div className="bonus-actions"><button className="btn secondary small" onClick={()=>signatureInput.current?.click()}><FileImage size={14}/>{tr(lang,'addSignature')}</button>{signature&&<button className="icon-btn" onClick={()=>setSignature(null)}><Trash2 size={15}/></button>}</div></div>{signature&&<><div className="signature-options"><label><input type="radio" checked={signaturePages==='all'} onChange={()=>setSignaturePages('all')}/>{tr(lang,'allPages')}</label><label><input type="radio" checked={signaturePages==='selected'} onChange={()=>setSignaturePages('selected')}/>{tr(lang,'selectedPages')}</label></div>{signaturePages==='selected'&&<input className="page-input" placeholder={tr(lang,'examplePages')} value={signatureSelected.join(',')} onChange={e=>setSignatureSelected(e.target.value.split(',').map(x=>Number(x.trim())).filter(Boolean))}/>}</>}</div></div><input ref={logoInput} hidden type="file" accept="image/png" onChange={handleLogo}/><input ref={signatureInput} hidden type="file" accept="image/png" onChange={handleSignature}/></section>}
        <section className="content-grid"><div className="panel checklist"><div className="panel-head"><div><h2>{tr(lang,'requirements')}</h2><p>{tr(lang,'packageInfo')}</p></div><span className="count-pill">{data.requirements.length}</span></div><div className="checklist-list">{data.requirements.map((r,idx)=>{const status=statuses[r.id],matched=fileById[matches[r.id]],usedElsewhere=new Set(Object.entries(matches).filter(([rid])=>rid!==r.id).map(([,fid])=>fid));const options=files.filter(f=>!usedElsewhere.has(f.id)||f.id===matches[r.id]).filter(f=>{const group=hashGroups[f.hash]||[];const otherMatched=group.some(x=>x.id!==f.id&&matchedFileIds.has(x.id));return !otherMatched||f.id===matches[r.id]});return <div className="requirement" key={r.id}><div className="req-number">{String(idx+1).padStart(2,'0')}</div><div className="req-copy"><div className="req-title-line"><div><strong>{titleFor(r,lang)}</strong><div className="req-tags"><code>{r.id}</code><span className={r.mandatory?'tag required':'tag optional'}>{r.mandatory?tr(lang,'required'):tr(lang,'optional')}</span>{r.has_expiry&&<span className="tag expiry">{tr(lang,'expiry')}</span>}</div></div><StatusBadge status={status} lang={lang}/></div></div><div className="req-controls"><select value={matches[r.id]||''} onChange={e=>assign(r.id,e.target.value)}><option value="">{tr(lang,'none')}</option>{options.map(f=><option key={f.id} value={f.id}>{f.name}{duplicateHashes.has(f.hash)?` • ${tr(lang,'duplicate')}`:''}</option>)}</select>{matched&&r.has_expiry&&<input aria-label={tr(lang,'expiry')} type="date" min="0001-01-01" value={expiries[r.id]||''} onChange={e=>{setExpiries(p=>({...p,[r.id]:e.target.value}));setGenerated(null)}}/>}{matched&&<button className="mini-btn danger" title={tr(lang,'removeMatch')} onClick={()=>assign(r.id,'')}><X size={14}/></button>}</div></div>})}</div></div>
          <aside className="panel file-panel" onDragOver={e=>{e.preventDefault();if(data)setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={async e=>{e.preventDefault();setDragging(false);await addFiles(e.dataTransfer.files)}}><div className="panel-head"><div><h2>{tr(lang,'files')}</h2><p>{files.length}/{MAX_FILES} • {formatBytes(files.reduce((s,f)=>s+f.size,0))}</p></div><button className="icon-btn" onClick={()=>pdfInput.current?.click()} disabled={busy}><Plus size={18}/></button></div><div className="file-tools"><div className="search-box"><Search size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={tr(lang,'search')}/></div><button className="text-btn" onClick={clearEverything} disabled={!files.length}>{tr(lang,'clearFiles')}</button></div>{dragging&&<div className="drop-overlay"><Upload size={30}/><strong>{tr(lang,'dropTitle')}</strong><span>{tr(lang,'dropText')}</span></div>}{!files.length?<div className="empty-files"><Upload size={28}/><strong>{tr(lang,'emptyFiles')}</strong><span>{tr(lang,'emptyFilesText')}</span><button className="btn secondary small" onClick={()=>pdfInput.current?.click()}>{tr(lang,'choose')}</button></div>:<div className="files-list">{filteredFiles.map(file=>{const duplicate=duplicateHashes.has(file.hash),matchedRid=Object.entries(matches).find(([,fid])=>fid===file.id)?.[0];return <div className={`file-item ${duplicate?'duplicate':''}`} key={file.id}><div className="file-symbol"><FileText size={17}/></div><div className="file-info"><strong title={file.name}>{file.name}</strong><span>{file.pages} {tr(lang,'pages')} • {formatBytes(file.size)}</span>{duplicate&&<em><Copy size={12}/>{tr(lang,'duplicateWarning')}</em>}{matchedRid&&<small><Check size={11}/>{tr(lang,'matchedTo')}: {titleFor(reqById[matchedRid],lang)}</small>}</div><button className="mini-btn" title={tr(lang,'preview')} onClick={()=>previewFile(file)}><Eye size={14}/></button><button className="mini-btn danger" title={tr(lang,'remove')} onClick={()=>removeFile(file.id)}><Trash2 size={14}/></button></div>})}</div>}</aside></section>
        <section className="bottom-bar"><div><strong>{ready?tr(lang,'ready'):`${blocking} ${tr(lang,'blocking')}`}</strong><span>{tr(lang,'local')}</span></div><div className="bottom-actions"><button className="btn secondary" onClick={resetWork}><RefreshCw size={16}/>{tr(lang,'reset')}</button><button className="btn primary large" disabled={!ready||busy} onClick={generatePackage}>{busy?<RefreshCw className="spin" size={17}/>:<Download size={17}/>} {tr(lang,'generate')}</button></div></section>
        {generated&&<section className="generated"><CheckCircle2 size={22}/><div><strong>{tr(lang,'generated')}</strong><span>{generated.name} • {generated.pages} {tr(lang,'generatedPages')} • {generated.count} {tr(lang,'documents')}</span></div><a className="btn secondary" href={generated.url} download={generated.name}><Download size={16}/>{tr(lang,'download')}</a></section>}
      </>}
    </main>
    <footer><span>{tr(lang,'local')}</span><span>• AI DevFest</span></footer>
    {preview&&<div className="modal-backdrop" onClick={()=>{URL.revokeObjectURL(preview.url);setPreview(null)}}><div className="preview-modal" onClick={e=>e.stopPropagation()}><div className="preview-head"><div><b>{preview.file.name}</b><span>{preview.file.pages} {tr(lang,'pages')}</span></div><button className="icon-btn" onClick={()=>{URL.revokeObjectURL(preview.url);setPreview(null)}}><X size={17}/></button></div><iframe src={preview.url} title={tr(lang,'previewTitle')} /></div></div>}
  </div>
}

function openDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open(APP_DB,1);req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains(APP_STORE))req.result.createObjectStore(APP_STORE,{keyPath:'id'})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}

createRoot(document.getElementById('root')).render(<App/>)
