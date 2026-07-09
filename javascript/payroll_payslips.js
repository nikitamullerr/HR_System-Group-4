/* ============================================================
   SHELL — Top bar and navigation
   Builds the navigation bar shown at the top of every page.
   It does three things:
     1. Defines the menu — the list of six pages (NAV).
     2. Builds the top bar (topbarHTML) — logo, tabs, theme
        toggle, and account button, highlighting the current page.
     3. Creates the page links (pageUrl) so the tabs actually
        open the right page when clicked.
   In short: this is the shared navigation bar that lets you
   move between all the sections of the HR system.
   ============================================================ */

const NAV = [
  {id:"dashboard", label:"Dashboard"},
  {id:"employees", label:"Employees"},
  {id:"time_off", label:"Time Off Management"},
  {id:"attendance", label:"Attendance Management"},
  {id:"payroll_payslips", label:"Payroll and Payslips"},
  {id:"performance_review", label:"Performance Reviews"},
];

function pageUrl(id) { 
  return id + ".html"; 
}

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

// Profile menu
document.getElementById("profileBtn")?.addEventListener("click", e => {
  e.stopPropagation();
  document.getElementById("profileMenu").classList.toggle("show");
});
document.getElementById("goProfile")?.addEventListener("click", () => { alert("Profile"); });
document.getElementById("logoutBtn")?.addEventListener("click", () => { location.href = "../index.html"; });
document.addEventListener("click", () => { document.getElementById("profileMenu")?.classList.remove("show"); });



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

const DEPT_COLOR = {};
DEPARTMENTS.forEach(d => DEPT_COLOR[d.name] = d.color);

const AVATAR_COLORS = ["#1d4ed8","#2563eb","#0ea5e9","#6366f1","#0891b2","#3b82f6","#4f46e5","#7c3aed","#0284c7","#4338ca"];

const REVIEW_DATES = ["12 Jan 2026","03 Feb 2026","15 Mar 2026","22 Apr 2026","09 May 2026","18 Jun 2026"];

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function parseDate(s) {
  const [y,m,d] = s.split("-").map(Number);
  return {y, m: m-1, d};
}

/* ============================================================
   BUILD EMPLOYEES
   Creates the full list of employee records the app uses.
   It goes through the raw attendance/leave data and, for each
   person, combines it with their department/role info and their
   payroll info to build one complete employee object — including
   name, role, department, contact details, salary, hours,
   leave, attendance status, rating, and hire year.
   The finished list is what every page (Employees, Payroll,
   Attendance, etc.) reads from.
   ============================================================ */

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

/* ============================================================
   STATE
   Sets up the app's shared data that every page reads from.
   Builds the employee list, works out the total monthly payroll,
   and stores it all in one "state" object — along with a few
   settings the pages use (like the current payroll page number,
   the payroll search text, and the selected employee).
   ============================================================ */

const employees = buildEmployees();

// Calculate total monthly payroll
const totalMonthlyPayroll = employees.reduce((sum, e) => sum + e.finalSalary, 0);

const state = {
  employees: employees,
  totalMonthlyPayroll: totalMonthlyPayroll,
  departments: DEPARTMENTS,
  payPage: 1,
  payQuery: "",
  payrollEmp: 1
};

/* ============================================================
   UI HELPERS
   Small shortcut tools used all over the app:
   $  — finds one element on the page
   $$ — finds all matching elements
   toast — shows a brief pop-up message.
   ============================================================ */

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

function openModal(title, bodyHTML, footHTML) {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.innerHTML =
    `<div class="mhead">${title}<button id="mx" aria-label="Close">&times;</button></div>
     <div class="mbody">${bodyHTML}</div>
     ${footHTML ? `<div class="mfoot">${footHTML}</div>` : ''}`;
  document.getElementById('modalBg').classList.add('show');
  document.getElementById('mx').addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('modalBg').classList.remove('show');
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const modalBg = document.getElementById('modalBg');
  if (modalBg) {
    modalBg.addEventListener('click', e => {
      if (e.target.id === 'modalBg') closeModal();
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

function money(n) {
  return "R" + Math.round(n).toLocaleString();
}

function moneyShort(n) {
  if (n >= 1e9) return "R" + (n/1e9).toFixed(1) + "B";
  if (n >= 1e6) return "R" + (n/1e6).toFixed(2) + "M";
  if (n >= 1e3) return "R" + (n/1e3).toFixed(0) + "K";
  return "R" + n;
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function avatar(e, cls = "") {
  return `<span class="avatar ${cls}" style="background:${e.avatar || e.deptColor || '#1d4ed8'}">${initials(e.name)}</span>`;
}

function statusPill(s) {
  const cls = s === "Active" ? "active" : (s === "Remote" ? "remote" : "leave");
  return `<span class="pill ${cls}"><span class="dot" style="background:currentColor"></span>${s}</span>`;
}

function pagerHTML(total, page, pages, start, shown) {
  let btns = `<button class="pg" data-pg="${page - 1}" ${page <= 1 ? 'disabled' : ''}>‹</button>`;
  
  const win = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) win.push(p);
  }
  
  let last = 0;
  win.forEach(p => {
    if (p - last > 1) {
      btns += `<span style="color:var(--muted);padding:0 4px">…</span>`;
    }
    btns += `<button class="pg ${p === page ? 'active' : ''}" data-pg="${p}">${p}</button>`;
    last = p;
  });
  
  btns += `<button class="pg" data-pg="${page + 1}" ${page >= pages ? 'disabled' : ''}>›</button>`;
  const from = total ? start + 1 : 0;
  
  return `<div class="pager">
    <span class="info">Showing ${from}–${start + shown} of ${total}</span>
    <div class="controls">${btns}</div>
  </div>`;
}

function wirePager(selector, callback) {
  $$(`${selector} [data-pg]`).forEach(btn => {
    btn.onclick = () => {
      if (!btn.disabled) callback(+btn.dataset.pg);
    };
  });
}

/* ============================================================
   MAIN RENDER FUNCTION
   Draws the Payroll & Payslips page.
   Remembers which tab is open ("payroll" or "payslips"), lays out
   the page heading and the two tab buttons, then loads the content
   for whichever tab is currently selected.
   ============================================================ */

let currentTab = "payroll";

function renderPayroll() {
  const main = document.getElementById('main');
  if (!main) {
    console.error('Main element not found');
    return;
  }
  
  main.innerHTML = `
    <div class="page-head">
      <div class="eyebrow">Finance</div>
      <div class="page-title">Payroll &amp; Payslips</div>
      <div class="page-sub">Run payroll and view individual payslips.</div>
    </div>
    <div class="tabs">
      <button class="tab ${currentTab === 'payroll' ? 'active' : ''}" data-tab="payroll">Payroll</button>
      <button class="tab ${currentTab === 'payslips' ? 'active' : ''}" data-tab="payslips">Payslips</button>
    </div>
    <div id="ppBody"></div>
  `;
  
  // Wire tabs
  document.querySelectorAll('.tab[data-tab]').forEach(tab => {
    tab.onclick = () => {
      currentTab = tab.dataset.tab;
      renderPayroll();
    };
  });
  
  const body = document.getElementById('ppBody');
  if (currentTab === 'payroll') {
    renderPayrollTab();
  } else {
    renderPayslipsTab();
  }
}

/* ============================================================
   TAB 1: PAYROLL
   Draws the Payroll tab: the KPI summary cards (total monthly
   payroll, employees paid, average net pay, pay-run status) and
   the searchable, paginated employee table with a "View payslip"
   button on each row.
   // Wire tabs
// Make each tab button clickable: remember which tab was clicked
// and re-draw the page so it shows that tab.

// Show the content for the selected tab:
// "payroll" tab → the payroll summary + table,
// otherwise    → the payslips document view.
   ============================================================ */

function renderPayrollTab() {
  const body = document.getElementById('ppBody');
  if (!body) return;
  
  const total = state.totalMonthlyPayroll;
  const avgNet = Math.round(total / state.employees.length);
  
  body.innerHTML = `
    <div class="kpis">
      <div class="kpi">
        <div class="klab">Total Monthly Payroll</div>
        <div class="kval">${moneyShort(total)}</div>
        <span class="ktrend up">▲ 1.8%</span>
      </div>
      <div class="kpi">
        <div class="klab">Employees Paid</div>
        <div class="kval">${state.employees.length}</div>
      </div>
      <div class="kpi">
        <div class="klab">Average Net Pay</div>
        <div class="kval">${money(avgNet)}</div>
      </div>
      <div class="kpi">
        <div class="klab">Pay Run Status</div>
        <div class="kval" style="color:var(--ok)">Ready</div>
        <span class="ktrend up">On schedule</span>
      </div>
    </div>
    <div class="toolbar">
      <div class="search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input id="paySearch" placeholder="Search employee to view payslip…" value="${state.payQuery}">
      </div>
      <button class="btn" id="runPay">Run payroll</button>
    </div>
    <div class="card">
      <div class="thead emp-grid" style="grid-template-columns:2.4fr 1.4fr 1fr 1.2fr auto">
        <span>Employee</span>
        <span class="col-hide">Department</span>
        <span class="col-hide">Net Pay</span>
        <span class="col-hide">Status</span>
        <span></span>
      </div>
      <div id="payRows"></div>
      <div id="payPager"></div>
    </div>
  `;
  
  // Wire search
  const search = document.getElementById('paySearch');
  if (search) {
    search.addEventListener('input', e => {
      state.payQuery = e.target.value;
      state.payPage = 1;
      drawPayrollTable();
    });
  }
  
  // Wire run payroll button
  const runBtn = document.getElementById('runPay');
  if (runBtn) {
    runBtn.onclick = () => toast("Payroll queued for " + state.employees.length + " employees");
  }
  
  drawPayrollTable();
}

function drawPayrollTable() {
  const q = state.payQuery.toLowerCase();
  const PAY_PER_PAGE = 9;
  
  const rows = state.employees.filter(e => {
    return !q || (e.name + " " + e.dept).toLowerCase().includes(q);
  });
  
  const pages = Math.max(1, Math.ceil(rows.length / PAY_PER_PAGE));
  if (state.payPage > pages) state.payPage = 1;
  
  const start = (state.payPage - 1) * PAY_PER_PAGE;
  const slice = rows.slice(start, start + PAY_PER_PAGE);
  
  const rowsContainer = document.getElementById('payRows');
  const pagerContainer = document.getElementById('payPager');
  
  if (!rowsContainer || !pagerContainer) return;
  
  if (!slice.length) {
    rowsContainer.innerHTML = `<div class="empty">No employees match "${state.payQuery}".</div>`;
    pagerContainer.innerHTML = '';
    return;
  }
  
  const netPay = e => e.salary + e.overtime - e.deductions;
  
  rowsContainer.innerHTML = slice.map(e => `
    <div class="trow emp-grid" style="grid-template-columns:2.4fr 1.4fr 1fr 1.2fr auto">
      <div class="who-cell">
        ${avatar(e)}
        <div style="min-width:0">
          <div class="nm">${e.name}</div>
          <div class="rl">${e.role}</div>
        </div>
      </div>
      <span class="col-hide"><span class="pill dept">${e.dept}</span></span>
      <span class="col-hide" style="font-weight:700">${money(netPay(e))}</span>
      <span class="col-hide">${statusPill(e.status)}</span>
      <div class="row-actions">
        <button class="btn ghost sm" data-action="payslip" data-id="${e.id}">View payslip</button>
      </div>
    </div>
  `).join('');
  
  pagerContainer.innerHTML = pagerHTML(rows.length, state.payPage, pages, start, slice.length);
  
  // Wire payslip buttons
  document.querySelectorAll('#payRows [data-action="payslip"]').forEach(btn => {
    btn.onclick = () => viewPayslip(parseInt(btn.dataset.id));
  });
  
  wirePager('#payPager', page => {
    state.payPage = page;
    drawPayrollTable();
  });
}

/* ============================================================
   PAYSLIP MODAL
   Opens a pop-up showing one employee's payslip: their hours and
   leave deductions, plus a breakdown of basic salary, overtime,
   deductions, and net pay — with buttons to close, open the full
   payslip, or download it.

   // Fills in and paginates the payroll table (rows of employees with
// their net pay and a "View payslip" button), and re-draws it whenever
// the search box or page changes.
   ============================================================ */

function viewPayslip(id) {
  const e = state.employees.find(x => x.id === id);
  if (!e) return;
  
  const basic = e.salary;
  const ot = e.overtime || 0;
  const ded = e.deductions || 0;
  const net = basic + ot - ded;
  
  openModal(
    "Payslip · " + e.name,
    `
      <p style="color:var(--muted);margin-bottom:12px">${e.role} · ${e.dept}</p>
      <div class="line"><span>Hours worked</span><b>${e.hoursWorked}</b></div>
      <div class="line"><span>Leave deductions</span><b>${e.leaveDeductions}</b></div>
      <div class="pay-table" style="border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:12px">
        <div class="prow"><span>Basic Salary</span><span class="r"></span><span class="r">${money(basic)}</span></div>
        <div class="prow"><span>Overtime</span><span class="r"></span><span class="r">${money(ot)}</span></div>
        <div class="prow"><span>Deductions</span><span class="r"></span><span class="r">-${money(ded)}</span></div>
        <div class="prow net"><span><b>Net Pay</b></span><span class="r"></span><span class="r">${money(net)}</span></div>
      </div>
    `,
    `
      <button class="btn line" id="mclose">Close</button>
      <button class="btn ghost" id="mfull">Open full payslip</button>
      <button class="btn" id="mslip">Download payslip</button>
    `
  );
  
  document.getElementById('mclose').onclick = closeModal;
  
  document.getElementById('mfull').onclick = () => {
    state.payrollEmp = id;
    currentTab = 'payslips';
    closeModal();
    renderPayroll();
  };
  
  document.getElementById('mslip').onclick = () => {
    closeModal();
    window.print();
    toast("Downloaded " + e.name + "'s payslip");
  };
}

/* ============================================================
   TAB 2: PAYSLIPS
   Draws the Payslips tab: an employee picker on the left and a
   full itemised payslip document on the right. You choose a
   person and a pay period, and it shows their earnings,
   deductions, net pay, and year-to-date totals.
   ============================================================ */

const PS_PERIODS = ["January", "February", "March", "April", "May", "June"]
  .map((name, m) => ({
    m,
    name,
    year: 2026,
    range: `01 – ${new Date(2026, m + 1, 0).getDate()} ${name.slice(0, 3)} 2026`
  }));

let psEmpId = 1;
let psPeriod = 5;
let psQuery = "";

function renderPayslipsTab() {
  const body = document.getElementById('ppBody');
  if (!body) return;
  
  // Set default employee if not set
  if (!psEmpId || !state.employees.find(e => e.id === psEmpId)) {
    psEmpId = state.employees[0]?.id || 1;
  }
  
  body.innerHTML = `
    <div class="ps-grid">
      <div class="card ps-picker">
        <div class="ps-search">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input id="psSearch" placeholder="Find an employee…" value="${psQuery}">
        </div>
        <div class="ps-list" id="psList"></div>
      </div>
      <div id="slipDoc"></div>
    </div>
  `;
  
  // Wire search
  const search = document.getElementById('psSearch');
  if (search) {
    search.addEventListener('input', e => {
      psQuery = e.target.value;
      drawPayslipList();
    });
  }
  
  drawPayslipList();
  drawPayslipDoc();
}

function drawPayslipList() {
  const q = psQuery.toLowerCase();
  const rows = state.employees.filter(e => {
    return !q || (e.name + " " + e.role + " " + e.dept).toLowerCase().includes(q);
  }).slice(0, 9);
  
  const listContainer = document.getElementById('psList');
  if (!listContainer) return;
  
  if (!rows.length) {
    listContainer.innerHTML = `<div class="empty">No employees match "${psQuery}".</div>`;
    return;
  }
  
  listContainer.innerHTML = rows.map(e => `
    <button class="ps-item ${e.id === psEmpId ? 'active' : ''}" data-id="${e.id}">
      ${avatar(e)}
      <span class="ps-nm">
        <b>${e.name}</b>
        <span>${e.role}</span>
      </span>
    </button>
  `).join('');
  
  document.querySelectorAll('#psList [data-id]').forEach(btn => {
    btn.onclick = () => {
      psEmpId = parseInt(btn.dataset.id);
      drawPayslipList();
      drawPayslipDoc();
    };
  });
}

function drawPayslipDoc() {
  const e = state.employees.find(x => x.id === psEmpId) || state.employees[0];
  if (!e) return;
  
  psEmpId = e.id;
  const p = PS_PERIODS[psPeriod] || PS_PERIODS[0];
  
  // Calculate payslip figures
  const f = calculatePayslipFigures(e, psPeriod);
  const ytd = calculateYTD(e, psPeriod);
  
  const periodOpts = PS_PERIODS.map(pr => `
    <option value="${pr.m}" ${pr.m === psPeriod ? 'selected' : ''}>${pr.name} ${pr.year}</option>
  `).join('');
  
  const logo = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5"/></svg>';
  
  const docContainer = document.getElementById('slipDoc');
  if (!docContainer) return;
  
  docContainer.innerHTML = `
    <div class="panel slip-doc" id="slipPaper">
      <div class="slip-top">
        <div class="slip-brand">
          <span class="slip-logo">${logo}</span>
          <div>
            <b>ModernTech Inc.</b>
            <span>100 Market Street · San Francisco, CA</span>
          </div>
        </div>
        <div class="slip-title">
          <div class="eyebrow">Payslip</div>
          <b>${p.name} ${p.year}</b>
          <span>${p.range}</span>
        </div>
      </div>
      
      <div class="slip-emp">
        ${avatar(e)}
        <div class="slip-emp-main">
          <b>${e.name}</b>
          <span>${e.role} · ${e.dept}</span>
        </div>
        <div class="slip-emp-meta">
          <div>
            <span>Employee ID</span>
            <b>MT-${String(e.id).padStart(4, "0")}</b>
          </div>
          <div>
            <span>Hours worked</span>
            <b>${e.hoursWorked}</b>
          </div>
          <div>
            <span>Leave deductions</span>
            <b>${e.leaveDeductions}</b>
          </div>
        </div>
      </div>
      
      <div class="slip-period">
        <label>Pay period</label>
        <select class="select" id="psPeriod">${periodOpts}</select>
      </div>
      
      <div class="slip-cols">
        <div class="slip-block">
          <div class="slip-h">Earnings</div>
          <div class="slip-row"><span>Basic salary</span><b>${money(f.basic)}</b></div>
          <div class="slip-row"><span>Overtime</span><b>${money(f.ot)}</b></div>
          <div class="slip-row total"><span>Gross pay</span><b>${money(f.gross)}</b></div>
        </div>
        <div class="slip-block">
          <div class="slip-h">Deductions</div>
          <div class="slip-row"><span>PAYE tax</span><b>-${money(f.tax)}</b></div>
          <div class="slip-row"><span>Pension</span><b>-${money(f.pension)}</b></div>
          <div class="slip-row"><span>Other</span><b>-${money(f.other)}</b></div>
          <div class="slip-row total"><span>Total deductions</span><b>-${money(f.totalDed)}</b></div>
        </div>
      </div>
      
      <div class="slip-net">
        <span>Net pay · ${p.name} ${p.year}</span>
        <b>${money(f.net)}</b>
      </div>
      
      <div class="slip-ytd">
        <div class="slip-h">Year to date (Jan – ${p.name.slice(0, 3)} ${p.year})</div>
        <div class="ytd-row"><span>Gross earnings</span><b>${money(ytd.earn)}</b></div>
        <div class="ytd-row"><span>Deductions</span><b>-${money(ytd.ded)}</b></div>
        <div class="ytd-row total"><span>Net paid</span><b>${money(ytd.net)}</b></div>
      </div>
      
      <div class="slip-actions">
        <button class="btn" id="slipPrint">Download PDF</button>
        <button class="btn ghost" id="slipPayroll">Back to Payroll</button>
      </div>
    </div>
  `;
  
  // Wire period selector
  const periodSelect = document.getElementById('psPeriod');
  if (periodSelect) {
    periodSelect.onchange = () => {
      psPeriod = parseInt(periodSelect.value);
      drawPayslipDoc();
    };
  }
  
  // Wire print button
  const printBtn = document.getElementById('slipPrint');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
      toast(`Preparing ${e.name}'s payslip — ${p.name} ${p.year}`);
    };
  }
  
  // Wire back button
  const backBtn = document.getElementById('slipPayroll');
  if (backBtn) {
    backBtn.onclick = () => {
      currentTab = 'payroll';
      renderPayroll();
    };
  }
}

/* ============================================================
   PAYSLIP CALCULATIONS
   Works out the money figures shown on a payslip.
   calculatePayslipFigures — for one month: basic pay, overtime,
     tax, pension, other deductions, gross, and net pay.
   calculateYTD — adds up every month up to the chosen one to
     give the year-to-date totals (earnings, deductions, net).
   ============================================================ */

function calculatePayslipFigures(e, monthIndex) {
  const basic = e.salary;
  const otFactor = 0.6 + ((e.id * 7 + monthIndex * 13) % 9) / 10;
  const ot = Math.round((e.overtime || 0) * otFactor);
  const ratio = (e.salary + (e.overtime || 0)) > 0 
    ? (e.deductions || 0) / (e.salary + (e.overtime || 0)) 
    : 0.15;
  const totalDed = Math.round((basic + ot) * ratio);
  const tax = Math.round(totalDed * 0.68);
  const pension = Math.round(totalDed * 0.22);
  const other = Math.max(0, totalDed - tax - pension);
  
  return {
    basic,
    ot,
    gross: basic + ot,
    tax,
    pension,
    other,
    totalDed,
    net: basic + ot - totalDed
  };
}

function calculateYTD(e, monthIndex) {
  let earn = 0;
  let ded = 0;
  let net = 0;
  
  for (let m = 0; m <= monthIndex; m++) {
    const f = calculatePayslipFigures(e, m);
    earn += f.gross;
    ded += f.totalDed;
    net += f.net;
  }
  
  return { earn, ded, net };
}

/* ============================================================
   BOOT
   Runs when the page finishes loading. It opens the right tab
   (Payslips if we arrived here from a "view payslip" link,
   otherwise Payroll) and draws the page. It also exposes a few
   functions globally so other parts of the app can use them.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Payroll initializing...');
  
  // Check if there's a stored employee ID to show
  try {
    const pre = sessionStorage.getItem("mt-payslipEmp");
    if (pre) {
      psEmpId = parseInt(pre);
      currentTab = 'payslips';
      sessionStorage.removeItem("mt-payslipEmp");
    }
  } catch (e) {
    // Ignore
  }
  
  renderPayroll();
});

// Make functions available globally
window.renderPayroll = renderPayroll;
window.state = state;
