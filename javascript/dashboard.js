/* =================================================================
   SHELL — Topbar and navigation
   ================================================================= */

const NAV = [ 
  {id:"dashboard", label:"Dashboard"},
  {id:"employees", label:"Employees"},
  {id:"time_off", label:"Time Off Management"},
  {id:"attendance", label:"Attendance Management"},
  {id:"payroll_payslips", label:"Payroll and Payslips"},
  {id:"performance_review", label:"Performance Reviews"},
];

/* =================================================================
   PAGE URL GENERATOR
   -----------------------------------------------------------------
   Generates the relative file path for each navigation page based
   on the page ID.
   ================================================================= */

function pageUrl(id) {
   return id + ".html";
}

/* =================================================================
   TOPBAR HTML GENERATOR
   -----------------------------------------------------------------
   Creates the HTML for the application's top navigation bar,
   including the logo, navigation links, theme toggle,
   profile section, and hamburger menu.
   ================================================================= */

function topbarHTML(active) {
  const logo = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5"/></svg>';
  const links = NAV.map(n => `<a class="topnav-item ${n.id === active ? 'active' : ''}" href="${pageUrl(n.id)}">${n.label}</a>`).join("");
  return `
    <a class="tb-brand" href="${pageUrl('dashboard')}"><span class="tb-logo">${logo}</span><span class="tb-name">ModernTech HR</span></a>
    <nav class="topnav">${links}</nav>
    <button class="hamburger-btn" id="hamburgerBtn">
      <i class="bi-list"></i>
    </button>
    
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
const active = document.body.dataset.page || "dashboard";
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
  
  // Close mobile nav when clicking a link
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

/* =================================================================
   THEME MANAGEMENT
   -----------------------------------------------------------------
   Handles light and dark mode functionality by saving the selected
   theme to localStorage and updating the interface accordingly.
   ================================================================= */
const THEME_KEY = "mt-theme";

function currentTheme() { 
  try { return localStorage.getItem(THEME_KEY) || "light"; } 
  catch(e) { return "light"; } 
}

function updateThemeIcon(t) {
  const btn = document.getElementById("themeBtn");
  if (!btn) return;
  if (t === "dark") {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  } else {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  }
}

function applyTheme(t) { 
  document.documentElement.setAttribute("data-theme", t); 
  try { localStorage.setItem(THEME_KEY, t); } catch(e) {} 
  updateThemeIcon(t);
}

// Apply saved theme on load
applyTheme(currentTheme());

// Theme button click handler
document.getElementById("themeBtn")?.addEventListener("click", () => {
  applyTheme(currentTheme() === "dark" ? "light" : "dark");
});

/* =================================================================
   PROFILE MENU
   -----------------------------------------------------------------
   Controls the profile dropdown menu, profile navigation,
   logout functionality, and automatic closing of the menu.
   ================================================================= */
document.getElementById("profileBtn")?.addEventListener("click", e => {
  e.stopPropagation();
  document.getElementById("profileMenu").classList.toggle("show");
});
document.getElementById("goProfile")?.addEventListener("click", () => { alert("Profile"); });
document.getElementById("logoutBtn")?.addEventListener("click", () => { location.href = "../index.html"; });
document.addEventListener("click", () => { document.getElementById("profileMenu")?.classList.remove("show"); });

/* =================================================================
   DUMMY EMPLOYEE DATA
   -----------------------------------------------------------------
   Contains sample attendance records and leave requests used for
   demonstrating the HR dashboard.
   ================================================================= */
const ATTENDANCE_LEAVE = [
  {employeeId:1,name:"Sibongile Nkosi",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Absent"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-22",reason:"Sick Leave",status:"Approved"},{date:"2024-12-01",reason:"Personal",status:"Pending"}]},
  {employeeId:2,name:"Lungile Moyo",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Absent"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-15",reason:"Family Responsibility",status:"Denied"},{date:"2024-12-02",reason:"Vacation",status:"Approved"}]},
  {employeeId:3,name:"Thabo Molefe",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Absent"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-10",reason:"Medical Appointment",status:"Approved"},{date:"2024-12-05",reason:"Personal",status:"Pending"}]},
  {employeeId:4,name:"Keshav Naidoo",attendance:[{date:"2025-07-25",status:"Absent"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-20",reason:"Bereavement",status:"Approved"}]},
  {employeeId:5,name:"Zanele Khumalo",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Absent"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2024-12-01",reason:"Childcare",status:"Pending"}]},
  {employeeId:6,name:"Sipho Zulu",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Absent"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-18",reason:"Sick Leave",status:"Approved"}]},
  {employeeId:7,name:"Naledi Moeketsi",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Absent"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-22",reason:"Vacation",status:"Pending"}]},
  {employeeId:8,name:"Farai Gumbo",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Absent"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2024-12-02",reason:"Medical Appointment",status:"Approved"}]},
  {employeeId:9,name:"Karabo Dlamini",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Present"},{date:"2025-07-28",status:"Absent"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2025-07-19",reason:"Childcare",status:"Denied"}]},
  {employeeId:10,name:"Fatima Patel",attendance:[{date:"2025-07-25",status:"Present"},{date:"2025-07-26",status:"Present"},{date:"2025-07-27",status:"Absent"},{date:"2025-07-28",status:"Present"},{date:"2025-07-29",status:"Present"}],leaveRequests:[{date:"2024-12-03",reason:"Vacation",status:"Pending"}]},
];

/* =================================================================
   PAYROLL DATA
   -----------------------------------------------------------------
   Stores payroll-related information including hours worked,
   leave deductions, and calculated salaries.
   ================================================================= */
const PAYROLL = {
  1:{hoursWorked:160,leaveDeductions:8,finalSalary:69500},
  2:{hoursWorked:150,leaveDeductions:10,finalSalary:79000},
  3:{hoursWorked:170,leaveDeductions:4,finalSalary:54800},
  4:{hoursWorked:165,leaveDeductions:6,finalSalary:59700},
  5:{hoursWorked:158,leaveDeductions:5,finalSalary:57850},
  6:{hoursWorked:168,leaveDeductions:2,finalSalary:64800},
  7:{hoursWorked:175,leaveDeductions:3,finalSalary:71800},
  8:{hoursWorked:160,leaveDeductions:0,finalSalary:56000},
  9:{hoursWorked:155,leaveDeductions:5,finalSalary:61500},
  10:{hoursWorked:162,leaveDeductions:4,finalSalary:57750},
};

/* =================================================================
   EMPLOYEE METADATA
   -----------------------------------------------------------------
   Contains department and job role information for each employee.
   ================================================================= */
const EMP_META = {
  1:{dept:"People",role:"HR Coordinator"},
  2:{dept:"Sales",role:"Account Executive"},
  3:{dept:"Engineering",role:"Software Engineer"},
  4:{dept:"Finance",role:"Financial Analyst"},
  5:{dept:"Marketing",role:"Marketing Specialist"},
  6:{dept:"Operations",role:"Operations Analyst"},
  7:{dept:"Engineering",role:"Senior Software Engineer"},
  8:{dept:"Support",role:"Support Lead"},
  9:{dept:"Product",role:"Product Manager"},
  10:{dept:"Design",role:"UI Designer"},
};

/* =================================================================
   DEPARTMENT DEFINITIONS
   -----------------------------------------------------------------
   Defines all company departments together with their display
   colours for charts and dashboard components.
   ================================================================= */
const DEPARTMENTS = [
  {name:"Engineering", color:"#1d4ed8"},
  {name:"Sales", color:"#0ea5e9"},
  {name:"Marketing", color:"#6366f1"},
  {name:"Finance", color:"#0891b2"},
  {name:"People", color:"#2563eb"},
  {name:"Operations", color:"#3b82f6"},
  {name:"Product", color:"#4f46e5"},
  {name:"Support", color:"#38bdf8"},
  {name:"Design", color:"#7c3aed"},
];

/* =================================================================
   SUPPORTING CONSTANTS
   -----------------------------------------------------------------
   Stores reusable values such as department colour mappings,
   avatar colours, review dates, and month names.
   ================================================================= */
const DEPT_COLOR = {};
DEPARTMENTS.forEach(d => DEPT_COLOR[d.name] = d.color);

const AVATAR_COLORS = ["#1d4ed8","#2563eb","#0ea5e9","#6366f1","#0891b2","#3b82f6","#4f46e5","#7c3aed","#0284c7","#4338ca"];

const REVIEW_DATES = ["12 Jan 2026","03 Feb 2026","15 Mar 2026","22 Apr 2026","09 May 2026","18 Jun 2026"];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseDate(s) {
  const [y,m,d] = s.split("-").map(Number);
  return {y, m: m-1, d};
}

/* =================================================================
   BUILD EMPLOYEES
   ================================================================= */

function buildEmployees() {
  const employees = [];
  
  ATTENDANCE_LEAVE.forEach((rec) => {
    const id = rec.employeeId;
    const meta = EMP_META[id] || {dept:"Operations", role:"Team Member"};
    const pay = PAYROLL[id] || {hoursWorked:160, leaveDeductions:0, finalSalary:0};
    const [first, ...rest] = rec.name.split(" ");
    const last = rest.join(" ");
    
    // Check if employee is on leave in July 2025
    const onLeave = rec.leaveRequests.some(l => {
      const dt = parseDate(l.date);
      return l.status === "Approved" && dt.y === 2025 && dt.m === 6;
    });
    
    employees.push({
      id,
      name: rec.name,
      first,
      last,
      role: meta.role,
      dept: meta.dept,
      deptColor: DEPT_COLOR[meta.dept] || "#1d4ed8",
      email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g,"")}@moderntech.io`,
      phone: `+27 82 555 ${String(1000 + id*37).slice(0,4)}`,
      salary: pay.finalSalary,
      overtime: 0,
      deductions: 0,
      finalSalary: pay.finalSalary,
      hoursWorked: pay.hoursWorked,
      leaveDeductions: pay.leaveDeductions,
      status: onLeave ? "On Leave" : "Active",
      rating: ((id * 7) % 4) + 2,
      hireYear: 2018 + (id % 7),
      avatar: AVATAR_COLORS[id % AVATAR_COLORS.length],
      reviewDate: REVIEW_DATES[id % REVIEW_DATES.length],
      attendanceLog: rec.attendance,
      leaveRequests: rec.leaveRequests
    });
  });
  
  return employees;
}

/* =================================================================
   BUILD STATS
   ================================================================= */

function buildStats(employees) {
  // Department counts
  const deptCounts = {};
  DEPARTMENTS.forEach(d => deptCounts[d.name] = 0);
  employees.forEach(e => {
    if (deptCounts[e.dept] !== undefined) deptCounts[e.dept]++;
  });
  
  // Status counts
  const statusCounts = { "Active": 0, "Remote": 0, "On Leave": 0 };
  employees.forEach(e => {
    if (statusCounts[e.status] !== undefined) statusCounts[e.status]++;
  });
  
  // Total payroll
  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.finalSalary, 0);
  
  // Average rating
  const avgRating = (employees.reduce((sum, e) => sum + e.rating, 0) / employees.length).toFixed(1);
  
  // Attendance data
  const attDates = ATTENDANCE_LEAVE[0].attendance.map(a => a.date);
  const dayLabels = attDates.map(d => {
    const p = parseDate(d);
    return `${p.d} ${months[p.m]}`;
  });
  
  const dailyPresent = attDates.map(date => {
    return employees.reduce((count, e) => {
      const log = e.attendanceLog.find(a => a.date === date);
      return count + (log && log.status === "Present" ? 1 : 0);
    }, 0);
  });
  
  const attendanceRate = Math.round(
    employees.reduce((sum, e) => {
      return sum + e.attendanceLog.filter(a => a.status === "Present").length;
    }, 0) / (employees.length * attDates.length) * 100
  );
  
  // Leave requests
  let reqId = 0;
  const requests = [];
  employees.forEach(e => {
    e.leaveRequests.forEach(l => {
      const dt = parseDate(l.date);
      if (l.status === "Pending") {
        requests.push({
          id: ++reqId,
          name: e.name,
          dept: e.dept,
          type: l.reason,
          year: dt.y,
          month: dt.m,
          day: dt.d
        });
      }
    });
  });
  
  return {
    deptCounts,
    statusCounts,
    totalMonthlyPayroll,
    avgRating,
    dayLabels,
    dailyPresent,
    attendanceRate,
    requests
  };
}

/* =================================================================
   STATE
   ================================================================= */

const employees = buildEmployees();
const stats = buildStats(employees);

const state = {
  employees: employees,
  departments: DEPARTMENTS,
  deptCounts: stats.deptCounts,
  statusCounts: stats.statusCounts,
  totalMonthlyPayroll: stats.totalMonthlyPayroll,
  avgRating: stats.avgRating,
  months: stats.dayLabels,
  attendance: stats.dailyPresent,
  attendanceRate: stats.attendanceRate,
  requests: stats.requests
};

/* =================================================================
   UI HELPERS
   ================================================================= */

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 2200);
}

function navigate(page) {
  const NAV = ['dashboard', 'employees', 'timeoff', 'attendance', 'payroll', 'reviews'];
  if (NAV.includes(page)) {
    location.href = `../${page}/${page}.html`;
  }
}

function moneyShort(n) {
  if (n >= 1e9) return "R" + (n/1e9).toFixed(1) + "B";
  if (n >= 1e6) return "R" + (n/1e6).toFixed(2) + "M";
  if (n >= 1e3) return "R" + (n/1e3).toFixed(0) + "K";
  return "R" + n;
}

/* =================================================================
   SVG CHART HELPERS
   ================================================================= */

function barSVG(values, labels, opts = {}) {
  const w = opts.w || 560;
  const h = opts.h || 240;
  const padL = 34;
  const padB = 26;
  const padT = 10;
  const padR = 6;
  const max = opts.max || Math.ceil(Math.max(...values) / 50) * 50 || 10;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const n = values.length;
  const gap = plotW / n;
  const bw = Math.min(30, gap * 0.5);

  let grid = "";
  let yl = "";
  
  for (let i = 0; i <= 4; i++) {
    const y = padT + plotH - (plotH * i / 4);
    const val = Math.round(max * i / 4);
    grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" class="grid-line"/>`;
    yl += `<text x="${padL - 6}" y="${y + 3}" text-anchor="end" class="axis-label">${val}</text>`;
  }
  
  const bars = values.map((v, i) => {
    const bh = (v / max) * plotH;
    const x = padL + gap * i + (gap - bw) / 2;
    const y = padT + plotH - bh;
    const col = opts.color || "url(#barGrad)";
    return `<g class="bar">
      <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${col}">
        <title>${labels[i]}: ${v}</title>
      </rect>
      <text x="${x + bw/2}" y="${h - 8}" text-anchor="middle" class="axis-label">${labels[i]}</text>
    </g>`;
  }).join("");

  return `<svg viewBox="0 0 ${w} ${h}" width="100%" class="barchart" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
    </defs>
    ${grid}${yl}${bars}
  </svg>`;
}

function donutSVG(segments, size = 190, stroke = 26) {
  const r = (size - stroke) / 2;
  const c = size / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let off = 0;
  
  const arcs = segments.map(seg => {
    const len = (seg.value / total) * C;
    const gap = 1.5;
    const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${stroke}"
      stroke-dasharray="${Math.max(len - gap, 0)} ${C - Math.max(len - gap, 0)}" stroke-dashoffset="${-off}"
      transform="rotate(-90 ${c} ${c})" stroke-linecap="round"/>`;
    off += len;
    return el;
  }).join("");
  
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${arcs}
    <text x="${c}" y="${c - 2}" text-anchor="middle" class="donut-total">${total}</text>
    <text x="${c}" y="${c + 18}" text-anchor="middle" class="donut-sub">Total</text>
  </svg>`;
}

/* =================================================================
   APPLY LEAVE DECISION
   ================================================================= */

function applyLeaveDecision(id, approve) {
  const r = state.requests.find(x => x.id === id);
  if (!r) return null;
  
  if (approve) {
    // Add to leave calendar (just keep in requests for now)
    toast(`✅ Approved: ${r.name} — ${r.type}`);
  } else {
    toast(`❌ Denied: ${r.name} — ${r.type}`);
  }
  
  state.requests = state.requests.filter(x => x.id !== id);
  return r;
}

/* =================================================================
   MAIN RENDER FUNCTION
   ================================================================= */

function renderDashboard() {
  const main = document.getElementById('main');
  if (!main) {
    console.error('Main element not found');
    return;
  }
  
  const totalEmp = state.employees.length;
  const pendingLeave = state.requests.length;
  
  // Department donut segments
  const segs = state.departments
    .map(d => ({
      label: d.name,
      value: state.deptCounts[d.name] || 0,
      color: d.color
    }))
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value);
  
  const legend = segs.map(s => `
    <div class="lg">
      <span class="sw" style="background:${s.color}"></span>
      ${s.label}
      <span class="ct">${s.value}</span>
    </div>
  `).join("");
  
  // Attendance review
  const onLeave = state.statusCounts["On Leave"] || 0;
  const remote = state.statusCounts["Remote"] || 0;
  const absent = Math.round(totalEmp * 0.03);
  const present = Math.max(0, totalEmp - remote - onLeave - absent);
  
  const attRows = [
    ["Present (on-site)", present, "#1d4ed8"],
    ["Remote", remote, "#0ea5e9"],
    ["On leave", onLeave, "#f59e0b"],
    ["Absent", absent, "#ef4444"]
  ].map(([label, value, color]) => `
    <div class="att-row">
      <span class="al">${label}</span>
      <span class="track">
        <span class="fill" style="width:${(value/totalEmp*100).toFixed(1)}%;background:${color}"></span>
      </span>
      <span class="av">${value} · ${(value/totalEmp*100).toFixed(0)}%</span>
    </div>
  `).join("");
  
  // Pending approvals
  const approvals = state.requests.slice(0, 4).map(r => `
    <div class="req">
      <div class="who">
        <b>${r.name}</b>
        <span style="color:var(--muted)">· ${r.type}</span>
      </div>
      <div class="row-actions">
        <button class="btn sm" data-action="approve" data-id="${r.id}">Approve</button>
        <button class="btn sm red" data-action="deny" data-id="${r.id}">Deny</button>
      </div>
    </div>
  `).join("") || `<div class="empty">No requests waiting.</div>`;
  
  // KPI icons
  const KIcon = {
    people: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>',
    money: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    cal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    star: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3 6.5 7 .6-5.3 4.6 1.7 6.8L12 17l-6.1 3.5 1.7-6.8L2.3 9.1l7-.6z"/></svg>'
  };
  
  /* ================================================================
   DASHBOARD USER INTERFACE
   ----------------------------------------------------------------
   Dynamically generates the main dashboard layout and inserts it
   into the <main> element using a template literal. The dashboard
   includes the page header, KPI summary cards, attendance charts,
   department statistics, attendance review, and pending leave
   requests.
   ================================================================ */

  main.innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Overview</div>
      <div class="page-title">Welcome back, HR Admin</div>
      <div class="page-sub">Here's what's happening across ModernTech today.</div>
    </div>

    <div class="kpis">
      <div class="kpi">
        <div class="kico" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8)">${KIcon.people}</div>
        <div class="klab">Total Employees</div>
        <div class="kval">${totalEmp}</div>
        <span class="ktrend up">▲ 4.2% vs last month</span>
      </div>
      <div class="kpi">
        <div class="kico" style="background:linear-gradient(135deg,#0ea5e9,#0369a1)">${KIcon.money}</div>
        <div class="klab">Monthly Payroll</div>
        <div class="kval">${moneyShort(state.totalMonthlyPayroll)}</div>
        <span class="ktrend up">▲ 1.8% vs last month</span>
      </div>
      <div class="kpi">
        <div class="kico" style="background:linear-gradient(135deg,#f59e0b,#d97706)">${KIcon.cal}</div>
        <div class="klab">Pending Leave</div>
        <div class="kval">${pendingLeave}</div>
        <span class="ktrend down">▼ 2 vs last week</span>
      </div>
      <div class="kpi">
        <div class="kico" style="background:linear-gradient(135deg,#6366f1,#4338ca)">${KIcon.star}</div>
        <div class="klab">Avg Performance</div>
        <div class="kval">${state.avgRating}<span style="font-size:16px;color:var(--muted)">/5</span></div>
        <span class="ktrend up">▲ 0.2 vs last cycle</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-title">
          <h3>Attendance Overview</h3>
          <span class="hint">Daily present headcount · ${state.attendanceRate}% for the period</span>
        </div>
        ${barSVG(state.attendance, state.months, {max: totalEmp})}
      </div>
      <div class="panel">
        <div class="panel-title"><h3>Workforce by Department</h3></div>
        <div style="display:flex;justify-content:center;margin:6px 0 10px">${donutSVG(segs)}</div>
        <div class="legend">${legend}</div>
      </div>
    </div>

    <div class="grid-2b">
      <div class="panel">
        <div class="panel-title">
          <h3>Attendance Review</h3>
          <span class="hint">Today</span>
        </div>
        ${attRows}
      </div>
      <div class="panel" style="padding:0">
        <div class="panel-title" style="padding:20px 20px 0">
          <h3>Leave Requests to Review</h3>
          <button class="btn ghost sm" id="dashSeeAll">See all</button>
        </div>
        <div style="margin-top:6px">${approvals}</div>
      </div>
    </div>
  `;
  
  // Wire quick approval buttons
  document.querySelectorAll('[data-action="approve"], [data-action="deny"]').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      const approve = btn.dataset.action === 'approve';
      applyLeaveDecision(id, approve);
      renderDashboard();
    };
  });
  
  // Wire "See all" button
  const seeAllBtn = document.getElementById('dashSeeAll');
  if (seeAllBtn) {
    seeAllBtn.onclick = () => navigate('timeoff');
  }
}

/* BOOT */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard initializing...');
  renderDashboard();
});

// Make functions available globally
window.renderDashboard = renderDashboard;
window.state = state;
