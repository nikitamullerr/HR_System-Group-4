/* =================================================================
   SHELL — Topbar and navigation with Hamburger
   ================================================================= */

const NAV = [
  {id:"dashboard", label:"Dashboard"},
  {id:"employees", label:"Employees"},
  {id:"time_off", label:"Time Off Management"},
  {id:"attendance", label:"Attendance Management"},
  {id:"payroll_payslips", label:"Payroll and Payslips"},
  {id:"performance_review", label:"Performance Reviews"},
];

function pageUrl(id) { return `${id}.html`; }

function topbarHTML(active) {
  const logo = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5"/></svg>';
  const links = NAV.map(n => `<a class="topnav-item ${n.id === active ? 'active' : ''}" href="${pageUrl(n.id)}">${n.label}</a>`).join("");
  return `
    <a class="tb-brand" href="${pageUrl('dashboard')}"><span class="tb-logo">${logo}</span><span class="tb-name">ModernTech HR</span></a>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle navigation">
      <i class="bi bi-list"></i>
    </button>
    <nav class="topnav">${links}</nav>
    <div class="top-spacer"></div>
    <div class="top-icons">
      <button class="icon-btn" id="themeBtn"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <button class="acct" id="profileBtn"><span class="av">HA</span><span class="who"><b>HR Admin</b><span>HR Manager</span></span></button>
    </div>
    <div class="menu" id="profileMenu">
      <button id="goProfile">My profile</button>
      <div class="sep"></div>
      <button id="logoutBtn">Log out</button>
    </div>
  `;
}

// Inject topbar
const active = document.body.dataset.page || "attendance";
const tb = document.getElementById("topbar");
if (tb) tb.innerHTML = topbarHTML(active);

// ---- Create mobile navigation ----
function createMobileNav() {
  const nav = document.createElement('div');
  nav.className = 'mobile-nav';
  nav.id = 'mobileNav';
  
  nav.innerHTML = NAV.map(n => `
    <a class="mobile-nav-item ${n.id === active ? 'active' : ''}" href="${pageUrl(n.id)}">
      ${n.label}
    </a>
  `).join('');
  
  document.body.appendChild(nav);
  
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
  
  return nav;
}

const mobileNav = createMobileNav();

// ---- Toggle mobile nav ----
document.getElementById('hamburgerBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileNav.classList.toggle('open');
});

// ---- Close mobile nav when clicking outside ----
document.addEventListener('click', (e) => {
  if (!e.target.closest('.hamburger-btn') && !e.target.closest('.mobile-nav')) {
    mobileNav.classList.remove('open');
  }
});

// ---- Close mobile nav on scroll ----
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    mobileNav.classList.remove('open');
  }, 100);
});

// ---- Theme toggle ----
const THEME_KEY = "mt-theme";

function currentTheme() {
  try { return localStorage.getItem(THEME_KEY) || "light"; }
  catch(e){ return "light"; }
}

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem(THEME_KEY, t); } catch(e){}
  updateThemeIcon(t);
}

function updateThemeIcon(t) {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;
  const isDark = t === "dark";
  btn.innerHTML = isDark 
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

// Apply saved theme on load
applyTheme(currentTheme());

// Theme button click handler
document.getElementById("themeBtn")?.addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

/* ---- Profile menu ---- */
document.getElementById("profileBtn")?.addEventListener("click", e => {
  e.stopPropagation();
  document.getElementById("profileMenu").classList.toggle("show");
});
document.getElementById("goProfile")?.addEventListener("click", () => alert("Profile"));

// FIXED: Changed from ../index.html to index.html
document.getElementById("logoutBtn")?.addEventListener("click", () => { 
  location.href = "index.html"; 
});

document.addEventListener("click", () => document.getElementById("profileMenu")?.classList.remove("show"));

/* ---------- source data (imported from JSON files) ---------- */
// These will be populated by loadData()


let ATTENDANCE_LEAVE = [];
let PAYROLL = {};
let EMP_META = {};

const DEPARTMENTS = [
  {name:"Engineering", color:"#1d4ed8", roles:["Software Engineer","Senior Software Engineer"]},
  {name:"Sales",       color:"#0ea5e9", roles:["Account Executive"]},
  {name:"Marketing",   color:"#6366f1", roles:["Marketing Specialist"]},
  {name:"Finance",     color:"#0891b2", roles:["Financial Analyst"]},
  {name:"People",      color:"#2563eb", roles:["HR Coordinator"]},
  {name:"Operations",  color:"#3b82f6", roles:["Operations Analyst"]},
  {name:"Product",     color:"#4f46e5", roles:["Product Manager"]},
  {name:"Support",     color:"#38bdf8", roles:["Support Lead"]},
  {name:"Design",      color:"#7c3aed", roles:["UI Designer"]},
];
const DEPT_COLOR = {}; DEPARTMENTS.forEach(d=>DEPT_COLOR[d.name]=d.color);
const AVATAR_COLORS = ["#1d4ed8","#2563eb","#0ea5e9","#6366f1","#0891b2","#3b82f6","#4f46e5","#7c3aed","#0284c7","#4338ca"];

/* leave-reason → colour (covers the reasons used in the dataset) */
const LEAVE_TYPES = {
  "Sick Leave":"#10b981", "Vacation":"#f59e0b", "Personal":"#2563eb",
  "Family Responsibility":"#7c3aed", "Medical Appointment":"#0891b2",
  "Bereavement":"#64748b", "Childcare":"#0ea5e9",
  "Vacation Leave":"#f59e0b", "Personal Leave":"#2563eb", "Unpaid Leave":"#ef4444",
};

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const parseDate = s => { const [y,m,d]=s.split("-").map(Number); return {y, m:m-1, d}; };

/* ---------- build employees ---------- */
const REVIEW_DATES = ["12 Jan 2026","03 Feb 2026","15 Mar 2026","22 Apr 2026","09 May 2026","18 Jun 2026"];
const DEDUCTION_RATE = 0.22;   // assumed statutory + leave deductions used to split gross vs net

/* an employee counts as "On Leave" if they have an approved leave in the current window (Jul 2025) */
function onLeaveInWindow(rec){
  return rec.leaveRequests.some(l=>{ const dt=parseDate(l.date); return l.status==="Approved" && dt.y===2025 && dt.m===6; });
}

let employees = [];
let deptCounts = {};
let statusCounts = {};
let totalMonthlyPayroll = 0;
let avgRating = 0;
let dayLabels = [];
let dailyPresent = [];
let attendanceRate = 0;
let requests = [];
let leave = [];
let notifications = [];
let messages = [];
let state = {};

function buildState() {
  employees = ATTENDANCE_LEAVE.map((rec,i)=>{
    const id = rec.employeeId;
    const meta = EMP_META[id] || {dept:"Operations", role:"Team Member"};
    const pay = PAYROLL[id] || {hoursWorked:160, leaveDeductions:0, finalSalary:0};
    const [first, ...rest] = rec.name.split(" ");
    const last = rest.join(" ");
    const net = pay.finalSalary;
    const gross = Math.round(net / (1 - DEDUCTION_RATE));
    const deductions = gross - net;
    return {
      id, name:rec.name, first, last,
      role: meta.role, dept: meta.dept, deptColor: DEPT_COLOR[meta.dept] || "#1d4ed8",
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g,"")}@moderntech.io`,
      phone: `+27 82 555 ${String(1000 + id*37).slice(0,4)}`,
      salary: gross, overtime: 0, deductions,
      finalSalary: net, hoursWorked: pay.hoursWorked, leaveDeductions: pay.leaveDeductions,
      status: onLeaveInWindow(rec) ? "On Leave" : "Active",
      rating: ((id*7) % 4) + 2,
      hireYear: 2018 + (id % 7),
      avatar: AVATAR_COLORS[id % AVATAR_COLORS.length],
      reviewDate: REVIEW_DATES[id % REVIEW_DATES.length],
      attendanceLog: rec.attendance,
      leaveRequests: rec.leaveRequests,
    };
  });

  /* ---------- derived company stats ---------- */
  deptCounts = {}; DEPARTMENTS.forEach(d=>deptCounts[d.name]=0);
  employees.forEach(e=>{ if(deptCounts[e.dept]!=null) deptCounts[e.dept]++; });
  statusCounts = { "Active":0, "Remote":0, "On Leave":0 };
  employees.forEach(e=>statusCounts[e.status]++);
  totalMonthlyPayroll = employees.reduce((s,e)=>s + e.finalSalary, 0);
  avgRating = (employees.reduce((s,e)=>s+e.rating,0)/employees.length).toFixed(1);

  /* daily present headcount across the recorded days */
  const attDates = ATTENDANCE_LEAVE[0].attendance.map(a=>a.date);
  dayLabels = attDates.map(d=>{ const p=parseDate(d); return `${p.d} ${months[p.m]}`; });
  dailyPresent = attDates.map(date=>
    employees.reduce((n,e)=> n + (e.attendanceLog.find(a=>a.date===date)?.status==="Present" ? 1 : 0), 0));
  attendanceRate = Math.round(
    employees.reduce((n,e)=> n + e.attendanceLog.filter(a=>a.status==="Present").length, 0) /
    (employees.length * attDates.length) * 100);

  /* leave: pending requests (to review) + approved entries (calendar), from real data */
  let _rid = 0, _lid = 0;
  requests = [];
  leave = [];
  employees.forEach(e=>{
    e.leaveRequests.forEach(l=>{
      const dt = parseDate(l.date);
      if(l.status==="Pending")
        requests.push({id:++_rid, name:e.name, dept:e.dept, type:l.reason, year:dt.y, month:dt.m, day:dt.d});
      if(l.status==="Approved")
        leave.push({id:++_lid, name:e.name, type:l.reason, year:dt.y, month:dt.m, day:dt.d});
    });
  });

  notifications = [
    {id:1, title:"New leave request", body:`${requests[0]?.name || "An employee"} requested ${(requests[0]?.type||"leave").toLowerCase()}`, time:"2h", read:false},
    {id:2, title:"Payroll ready for review", body:"Latest payroll run has completed", time:"5h", read:false},
    {id:3, title:"Attendance recorded", body:`Team attendance is ${attendanceRate}% for the period`, time:"1d", read:false},
  ];
  messages = [
    {id:1, from:"Finance", subject:"Payroll sign-off required", time:"09:41", read:false},
    {id:2, from:"People Ops", subject:"Leave requests awaiting review", time:"08:15", read:false},
  ];

  state = {
    company:"ModernTech",
    employees, departments:DEPARTMENTS, deptCounts, statusCounts,
    totalMonthlyPayroll, avgRating,
    months: dayLabels, attendance: dailyPresent, attendanceRate,
    requests, leave, notifications, messages,
    settings:{ emailNotif:true, desktopNotif:false, compact:false },
    empPage:1, empQuery:"", empDept:"All", empStatus:"All",
    payPage:1, payQuery:"",
    reviewTab:"performance", revPage:1, revQuery:"",
    timeoffTab:"pending", calMonth:6, calYear:2025,
    payrollEmp:1,
  };
}

const AUTH = { username:"ModernTech", password:"moderntech$" };

/* ---- Load data from JSON files ---- */
async function loadData() {
  const paths = [
    ["../data/attendance.json", "../data/employee_info.json", "../data/payroll_data.json"],
    ["data/attendance.json", "data/employee_info.json", "data/payroll_data.json"],
    ["attendance.json", "employee_info.json", "payroll_data.json"],
  ];

  let attendanceData = null;
  let employeeInfoData = null;
  let payrollData = null;

  for (const [attPath, empPath, payPath] of paths) {
    try {
      const [attRes, empRes, payRes] = await Promise.all([
        fetch(attPath), 
        fetch(empPath),
        fetch(payPath)
      ]);
      if (!attRes.ok || !empRes.ok || !payRes.ok) continue;
      attendanceData = await attRes.json();
      employeeInfoData = await empRes.json();
      payrollData = await payRes.json();
      break;
    } catch (_) {
      continue;
    }
  }

  if (!attendanceData || !employeeInfoData || !payrollData) {
    document.getElementById("main").innerHTML = `
      <div class="no-results" style="padding: 40px; text-align: center;">
        <h2>Could not load data</h2>
        <p>Open this page through a local server (e.g. <code>npx serve</code>).</p>
      </div>`;
    return false;
  }

  ATTENDANCE_LEAVE = attendanceData.attendanceAndLeave || attendanceData.attendance || [];
  PAYROLL = payrollData.payroll || payrollData || {};
  
  // Build EMP_META from employee_info
  EMP_META = {};
  (employeeInfoData.employeeInformation || employeeInfoData.employees || []).forEach(emp => {
    EMP_META[emp.employeeId] = {
      dept: emp.department || "Unknown",
      role: emp.position || "Team Member"
    };
  });

  buildState();
  return true;
}


/* =================================================================
   helpers.js — formatters, avatars, star ratings, SVG charts
   ================================================================= */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const money = n => "R" + Math.round(n).toLocaleString();
function moneyShort(n){
  if(n >= 1e9) return "R" + (n/1e9).toFixed(1) + "B";
  if(n >= 1e6) return "R" + (n/1e6).toFixed(2) + "M";
  if(n >= 1e3) return "R" + (n/1e3).toFixed(0) + "K";
  return "R" + n;
}
function initials(name){ return name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(); }
function avatar(e, cls=""){ return `<span class="avatar ${cls}" style="background:${e.avatar||e.deptColor||'#1d4ed8'}">${initials(e.name)}</span>`; }
function stars(n){
  let h='<span class="stars">';
  for(let i=1;i<=5;i++) h+=`<span class="${i<=n?'on':''}">&#9733;</span>`;
  return h+'</span>';
}
function statusPill(s){
  const cls = s==="Active"?"active":(s==="Remote"?"remote":"leave");
  return `<span class="pill ${cls}"><span class="dot" style="background:currentColor"></span>${s}</span>`;
}

/* ---------- SVG donut ---------- */
function donutSVG(segments, size=190, stroke=26){
  const r=(size-stroke)/2, c=size/2, C=2*Math.PI*r;
  const total = segments.reduce((s,x)=>s+x.value,0) || 1;
  let off=0;
  const arcs = segments.map(seg=>{
    const len = (seg.value/total)*C;
    const gap = 1.5;
    const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${stroke}"
      stroke-dasharray="${Math.max(len-gap,0)} ${C-Math.max(len-gap,0)}" stroke-dashoffset="${-off}"
      transform="rotate(-90 ${c} ${c})" stroke-linecap="round"/>`;
    off += len; return el;
  }).join("");
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${arcs}
    <text x="${c}" y="${c-2}" text-anchor="middle" class="donut-total">${total}</text>
    <text x="${c}" y="${c+18}" text-anchor="middle" class="donut-sub">Total</text>
  </svg>`;
}

/* ---------- SVG bar chart ---------- */
function barSVG(values, labels, opts={}){
  const w = opts.w || 560, h = opts.h || 240;
  const padL = 34, padB = 26, padT = 10, padR = 6;
  const max = opts.max || Math.ceil(Math.max(...values)/50)*50 || 10;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = values.length, gap = plotW/n, bw = Math.min(30, gap*0.5);

  let grid = "", yl = "";
  for(let i=0;i<=4;i++){
    const y = padT + plotH - (plotH*i/4);
    const val = Math.round(max*i/4);
    grid += `<line x1="${padL}" y1="${y}" x2="${w-padR}" y2="${y}" class="grid-line"/>`;
    yl += `<text x="${padL-6}" y="${y+3}" text-anchor="end" class="axis-label">${val}</text>`;
  }
  const bars = values.map((v,i)=>{
    const bh = (v/max)*plotH;
    const x = padL + gap*i + (gap-bw)/2;
    const y = padT + plotH - bh;
    const col = opts.color || "url(#barGrad)";
    return `<g class="bar"><rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${col}"><title>${labels[i]}: ${v}</title></rect>
      <text x="${x+bw/2}" y="${h-8}" text-anchor="middle" class="axis-label">${labels[i]}</text></g>`;
  }).join("");

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" class="barchart" preserveAspectRatio="xMidYMid meet">
    <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient></defs>
    ${grid}${yl}${bars}
  </svg>`;
}


/* =================================================================
   ui.js — shared cross-page UI used by several sections:
   pagination controls, the employee view/edit modal, and the
   leave-approval logic (shared by Dashboard + Time Off).
   ================================================================= */

/* ---------- pagination (Employees, Payroll, Reviews) ---------- */
function pagerHTML(total, page, pages, start, shown){
  let btns = `<button class="pg" data-pg="${page-1}" ${page<=1?'disabled':''}>‹</button>`;
  const win = [];
  for(let p=1;p<=pages;p++){ if(p===1||p===pages||Math.abs(p-page)<=1) win.push(p); }
  let last=0;
  win.forEach(p=>{ if(p-last>1) btns+=`<span style="color:var(--muted);padding:0 4px">…</span>`; btns+=`<button class="pg ${p===page?'active':''}" data-pg="${p}">${p}</button>`; last=p; });
  btns += `<button class="pg" data-pg="${page+1}" ${page>=pages?'disabled':''}>›</button>`;
  const from = total? start+1 : 0;
  return `<div class="pager"><span class="info">Showing ${from}–${start+shown} of ${total}</span><div class="controls">${btns}</div></div>`;
}
function wirePager(sel, cb){
  $$(`${sel} [data-pg]`).forEach(b=>b.onclick=()=>{ if(!b.disabled) cb(+b.dataset.pg); });
}

/* ---------- employee view / edit modal (Employees, Job Roles) ---------- */
function viewEmployee(id){
  const e = state.employees.find(x=>x.id===id);
  const net = e.salary+e.overtime-e.deductions;
  openModal("Employee Details",
    `<div style="display:flex;align-items:center;gap:14px;margin-bottom:8px">${avatar(e)}
       <div><div style="font-weight:800;font-size:17px">${e.name}</div><div style="color:var(--muted)">${e.role}</div></div></div>
     <div class="line"><span>Department</span><b>${e.dept}</b></div>
     <div class="line"><span>Status</span><b>${e.status}</b></div>
     <div class="line"><span>Email</span><b>${e.email}</b></div>
     <div class="line"><span>Phone</span><b>${e.phone}</b></div>
     <div class="line"><span>Hired</span><b>${e.hireYear}</b></div>
     <div class="line"><span>Performance</span><b>${stars(e.rating)}</b></div>
     <div class="line"><span>Net monthly pay</span><b>${money(net)}</b></div>`,
    `<button class="btn line" id="mclose">Close</button><button class="btn" id="medit">Edit</button>`);
  $("#mclose").onclick=closeModal; $("#medit").onclick=()=>editEmployee(id);
}

function editEmployee(id){
  const e = state.employees.find(x=>x.id===id);
  const deptOpts = state.departments.map(d=>`<option ${e.dept===d.name?'selected':''}>${d.name}</option>`).join("");
  openModal("Edit Employee",
    `<label>Full name</label><input class="field" id="f_name" value="${e.name}">
     <label>Role</label><input class="field" id="f_role" value="${e.role}">
     <label>Department</label><select class="select" id="f_dept" style="width:100%">${deptOpts}</select>
     <label>Email</label><input class="field" id="f_email" value="${e.email}" style="margin-top:6px">
     <label>Monthly salary (USD)</label><input class="field" id="f_sal" type="number" value="${e.salary}">`,
    `<button class="btn line" id="mcancel">Cancel</button><button class="btn green" id="msave">Save changes</button>`);
  $("#mcancel").onclick=closeModal;
  $("#msave").onclick=()=>{
    e.name=$("#f_name").value.trim()||e.name; e.role=$("#f_role").value.trim();
    e.dept=$("#f_dept").value; e.email=$("#f_email").value.trim(); e.salary=+$("#f_sal").value||e.salary;
    closeModal();
    if(typeof renderEmployees === "function") renderEmployees();
    toast("Saved changes to "+e.name);
  };
}

/* ---------- leave decisions (Dashboard quick-approve + Time Off) ---------- */
function nextLeaveId(){ return state.leave.reduce((m,l)=>Math.max(m,l.id),0)+1; }
function applyLeaveDecision(id, approve){
  const r = state.requests.find(x=>x.id===id);
  if(!r) return null;
  if(approve){
    const last = r.endDay || r.day;
    for(let d=r.day; d<=last; d++)
      state.leave.push({id:nextLeaveId(), name:r.name, type:r.type, year:r.year, month:r.month, day:d});
  }
  state.requests = state.requests.filter(x=>x.id!==id);
  return r;
}


/* =================================================================
   components.js — reusable UI primitives: toast + modal
   ================================================================= */
function toast(msg){
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(()=>t.classList.remove("show"), 2200);
}

function openModal(title, bodyHTML, footHTML){
  $("#modal").innerHTML =
    `<div class="mhead">${title}<button id="mx" aria-label="Close">&times;</button></div>
     <div class="mbody">${bodyHTML}</div>
     ${footHTML ? `<div class="mfoot">${footHTML}</div>` : ""}`;
  $("#modalBg").classList.add("show");
  $("#mx").addEventListener("click", closeModal);
}
function closeModal(){ $("#modalBg").classList.remove("show"); }

// dismiss on backdrop click or Escape
document.addEventListener("DOMContentLoaded", ()=>{
  $("#modalBg").addEventListener("click", e=>{ if(e.target.id==="modalBg") closeModal(); });
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });


/* ===================== attendance section ===================== */
/* =================================================================
   attendance.js — Attendance Management.
   Summary KPIs, daily present-headcount chart, and a per-employee
   attendance matrix (present/absent across the recorded days),
   all driven by the real attendance data in shared/data.js.
   ================================================================= */
function renderAttendance(){
  const emps = state.employees;
  const dates = emps[0].attendanceLog.map(a=>a.date);
  const dayHeads = state.months;
  const totalCells = emps.length * dates.length;
  const totalPresent = emps.reduce((n,e)=> n + e.attendanceLog.filter(a=>a.status==="Present").length, 0);
  const totalAbsent = totalCells - totalPresent;
  const avgPerDay = Math.round(state.attendance.reduce((a,b)=>a+b,0) / dates.length);
  const onLeave = state.statusCounts["On Leave"] || 0;

  const dot = st => st==="Present"
    ? `<span class="att-dot present" title="Present">P</span>`
    : `<span class="att-dot absent" title="Absent">A</span>`;

  const bodyRows = emps.map(e=>{
    const present = e.attendanceLog.filter(a=>a.status==="Present").length;
    const rate = Math.round(present/dates.length*100);
    const cells = dates.map(d=>{
      const rec = e.attendanceLog.find(a=>a.date===d);
      return `<td class="att-cell">${rec ? dot(rec.status) : "—"}</td>`;
    }).join("");
    return `<tr>
      <td class="att-emp"><div class="who-cell">${avatar(e)}<div style="min-width:0"><div class="nm">${e.name}</div><div class="rl">${e.role}</div></div></div></td>
      <td class="col-hide"><span class="pill dept">${e.dept}</span></td>
      ${cells}
      <td class="att-num">${present}/${dates.length}</td>
      <td class="att-num"><b>${rate}%</b></td>
    </tr>`;
  }).join("");

  $("#main").innerHTML = `
   <div class="page-head">
     <div class="eyebrow">Operations</div>
     <div class="page-title">Attendance Management</div>
     <div class="page-sub">Daily attendance across the team · ${dayHeads[0]} – ${dayHeads[dayHeads.length-1]} 2025</div>
   </div>

   <div class="kpis">
     <div class="kpi"><div class="klab">Attendance Rate</div><div class="kval">${state.attendanceRate}%</div><span class="ktrend up">team average</span></div>
     <div class="kpi"><div class="klab">Avg Present / Day</div><div class="kval">${avgPerDay}<span style="font-size:15px;color:var(--muted)"> / ${emps.length}</span></div></div>
     <div class="kpi"><div class="klab">Total Absences</div><div class="kval">${totalAbsent}</div><span class="ktrend">over ${dates.length} days</span></div>
     <div class="kpi"><div class="klab">On Leave</div><div class="kval">${onLeave}</div></div>
   </div>

   <div class="panel" style="margin-bottom:20px">
     <div class="panel-title"><h3>Daily Present Headcount</h3><span class="hint">People on-site each day</span></div>
     ${barSVG(state.attendance, dayHeads, {max: emps.length})}
   </div>

   <div class="card att-wrap">
     <div class="att-scroll">
       <table class="att-table">
         <thead><tr>
           <th class="att-emp">Employee</th>
           <th class="col-hide">Department</th>
           ${dayHeads.map(d=>`<th class="att-cell">${d}</th>`).join("")}
           <th class="att-num">Present</th>
           <th class="att-num">Rate</th>
         </tr></thead>
         <tbody>${bodyRows}</tbody>
       </table>
     </div>
   </div>`;
}

/* boot */
document.addEventListener("DOMContentLoaded", async () => {
  const success = await loadData();
  if (success) {
    renderAttendance();
  }
});