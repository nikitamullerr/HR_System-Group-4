/* SHELL — Topbar and navigation */

const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "employees", label: "Employees" },
  { id: "time_off", label: "Time Off Management" },
  { id: "attendance", label: "Attendance Management" },
  { id: "payroll_payslips", label: "Payroll and Payslips" },
  { id: "performance_review", label: "Performance Reviews" },
];

function pageUrl(id) {
  return id + ".html";
}

function topbarHTML(active) {
  const logo = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5"/></svg>';
  const links = NAV.map(function(n) {
    return '<a class="topnav-item ' + (n.id === active ? "active" : "") + '" href="' + pageUrl(n.id) + '">' + n.label + '</a>';
  }).join("");

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

// Inject the topbar for whichever page is currently active.
var active = document.body.dataset.page || "dashboard";
var tb = document.getElementById("topbar");
if (tb) tb.innerHTML = topbarHTML(active);

// ---- Create mobile navigation ----
function createMobileNav() {
  var nav = document.createElement('div');
  nav.className = 'mobile-nav';
  nav.id = 'mobileNav';
  
  nav.innerHTML = NAV.map(function(n) {
    return '<a class="mobile-nav-item ' + (n.id === active ? 'active' : '') + '" href="' + pageUrl(n.id) + '">' + n.label + '</a>';
  }).join('');
  
  document.body.appendChild(nav);
  
  // Close mobile nav when clicking a link
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
    });
  });
  
  return nav;
}

var mobileNav = createMobileNav();

// ---- Toggle mobile nav ----
var hamburgerBtn = document.getElementById('hamburgerBtn');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    mobileNav.classList.toggle('open');
  });
}

// ---- Close mobile nav when clicking outside ----
document.addEventListener('click', function(e) {
  if (!e.target.closest('.hamburger-btn') && !e.target.closest('.mobile-nav')) {
    mobileNav.classList.remove('open');
  }
});

// ---- Close mobile nav on scroll ----
var scrollTimeout;
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function() {
    mobileNav.classList.remove('open');
  }, 100);
});

// ---- Theme toggle ----
var THEME_KEY = "mt-theme";

function currentTheme() {
  try { 
    return localStorage.getItem(THEME_KEY) || "light"; 
  }
  catch(e) { 
    return "light"; 
  }
}

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { 
    localStorage.setItem(THEME_KEY, t); 
  } catch(e) {}
  updateThemeIcon(t);
}

function updateThemeIcon(t) {
  var btn = document.getElementById("themeBtn");
  if (!btn) return;
  var isDark = t === "dark";
  btn.innerHTML = isDark 
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

// Apply saved theme on load
applyTheme(currentTheme());

// Theme button click handler
var themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  themeBtn.addEventListener("click", function() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

/* ---- Profile menu ---- */
var profileBtn = document.getElementById("profileBtn");
if (profileBtn) {
  profileBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("show");
  });
}

var goProfileBtn = document.getElementById("goProfile");
if (goProfileBtn) {
  goProfileBtn.addEventListener("click", function() { 
    alert("Profile"); 
  });
}

var logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() { 
    // FIXED: Changed from ../index.html to index.html
    location.href = "index.html"; 
  });
}

document.addEventListener("click", function() {
  var menu = document.getElementById("profileMenu");
  if (menu) menu.classList.remove("show");
});


/* =================================================================
   DATA — employee records now live in JSON files (see loadData())
   instead of being hardcoded here. Everything else is unchanged.
   ================================================================= */

// Filled in by loadData() once the JSON files have loaded.
var ATTENDANCE_LEAVE = [];
var PAYROLL = {};
var EMP_META = {};


/* ---- Load dummy data from JSON files ---- */
async function loadData() {
  try {
    // Try to load from JSON files - note the correct filename is attendance.json
    var [attRes, payRes, metaRes] = await Promise.all([
      fetch("data/attendance.json"),
      fetch("data/payroll_data.json"),
      fetch("data/employee_info.json"),
    ]);
    
    if (!attRes.ok || !payRes.ok || !metaRes.ok) {
      console.warn('Failed to load JSON files, using sample data instead');
      ATTENDANCE_LEAVE = getSampleAttendance();
      PAYROLL = getSamplePayroll();
      EMP_META = getSampleMeta();
      toast("Using sample data - JSON files not found");
      return;
    }

    var attData = await attRes.json();
    var payData = await payRes.json();
    var metaData = await metaRes.json();

    ATTENDANCE_LEAVE = attData.attendanceAndLeave || [];
    PAYROLL = payData.payroll || {};
    EMP_META = metaData.meta || {};
    
    console.log('Data loaded successfully:', {
      employees: ATTENDANCE_LEAVE.length,
      payroll: Object.keys(PAYROLL).length,
      meta: Object.keys(EMP_META).length
    });
    
  } catch (err) {
    console.error('Error loading data:', err);
    toast("Couldn't load employee data — using sample data");
    ATTENDANCE_LEAVE = getSampleAttendance();
    PAYROLL = getSamplePayroll();
    EMP_META = getSampleMeta();
  }
}

var DEPARTMENTS = [
  { name: "Engineering", color: "#1d4ed8" },
  { name: "Sales", color: "#0ea5e9" },
  { name: "Marketing", color: "#6366f1" },
  { name: "Finance", color: "#0891b2" },
  { name: "People", color: "#2563eb" },
  { name: "Operations", color: "#3b82f6" },
  { name: "Product", color: "#4f46e5" },
  { name: "Support", color: "#38bdf8" },
  { name: "Design", color: "#7c3aed" },
];

var DEPT_COLOR = {};
DEPARTMENTS.forEach(function(d) { 
  DEPT_COLOR[d.name] = d.color; 
});

var LEAVE_TYPES = {
  "Sick Leave": "#10b981",
  "Vacation": "#f59e0b",
  "Personal": "#2563eb",
  "Family Responsibility": "#7c3aed",
  "Medical Appointment": "#0891b2",
  "Bereavement": "#64748b",
  "Childcare": "#0ea5e9",
};

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// "YYYY-MM-DD" -> {y, m (0-based), d}
function parseDate(s) {
  var parts = s.split("-").map(Number);
  return { y: parts[0], m: parts[1] - 1, d: parts[2] };
}


/* =================================================================
   BUILD EMPLOYEES — turn the raw attendance/leave records into the
   employee objects the rest of the app renders.
   ================================================================= */

function buildEmployees() {
  if (!ATTENDANCE_LEAVE || ATTENDANCE_LEAVE.length === 0) {
    console.warn('No attendance data available');
    return [];
  }
  
  return ATTENDANCE_LEAVE.map(function(rec) {
    var id = rec.employeeId;
    var meta = EMP_META[id] || { dept: "Operations", role: "Team Member" };
    var pay = PAYROLL[id] || { hoursWorked: 160, leaveDeductions: 0, finalSalary: 0 };
    var nameParts = rec.name.split(" ");
    var first = nameParts[0];
    var last = nameParts.slice(1).join(" ");

    // Currently on leave if they have an approved leave request in July 2025.
    var onLeave = rec.leaveRequests && rec.leaveRequests.some(function(l) {
      var dt = parseDate(l.date);
      return l.status === "Approved" && dt.y === 2025 && dt.m === 6;
    });

    return {
      id: id,
      name: rec.name,
      first: first,
      last: last,
      role: meta.role,
      dept: meta.dept,
      deptColor: DEPT_COLOR[meta.dept] || "#1d4ed8",
      email: first.toLowerCase() + "." + last.toLowerCase().replace(/[^a-z]/g, "") + "@moderntech.io",
      phone: "+27 82 555 " + String(1000 + id * 37).slice(0, 4),
      salary: pay.finalSalary,
      finalSalary: pay.finalSalary,
      hoursWorked: pay.hoursWorked,
      leaveDeductions: pay.leaveDeductions,
      status: onLeave ? "On Leave" : "Active",
      attendanceLog: rec.attendance || [],
      leaveRequests: rec.leaveRequests || [],
    };
  });
}


/* =================================================================
   STATE — populated by initState() once loadData() has resolved
   (kept as one stable object so window.state below stays valid).
   ================================================================= */

var state = {
  employees: [],
  requests: [],
  leave: [],
  leaveTypes: LEAVE_TYPES,
  timeoffTab: "pending",
  calMonth: 6,
  calYear: 2025,
};

function initState() {
  state.employees = buildEmployees();
  
  console.log('Building employees from:', ATTENDANCE_LEAVE.length, 'records');

  // Split each employee's leave requests into "pending" vs "approved" (booked).
  var reqId = 0;
  var leaveId = 0;
  var requests = [];
  var leave = [];

  state.employees.forEach(function(e) {
    if (e.leaveRequests && e.leaveRequests.length > 0) {
      e.leaveRequests.forEach(function(l) {
        var dt = parseDate(l.date);
        if (l.status === "Pending") {
          requests.push({ id: ++reqId, name: e.name, dept: e.dept, type: l.reason, year: dt.y, month: dt.m, day: dt.d });
        }
        if (l.status === "Approved") {
          leave.push({ id: ++leaveId, name: e.name, type: l.reason, year: dt.y, month: dt.m, day: dt.d });
        }
      });
    }
  });

  state.requests = requests;
  state.leave = leave;
  
  console.log('State initialized:', {
    employees: state.employees.length,
    requests: state.requests.length,
    leave: state.leave.length
  });
}


/* =================================================================
   UI HELPERS
   ================================================================= */

function $(s) { return document.querySelector(s); }
function $$(s) { return Array.from(document.querySelectorAll(s)); }

function toast(msg) {
  var t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._t);
  t._t = setTimeout(function() { 
    t.classList.remove("show"); 
  }, 2200);
}

function openModal(title, bodyHTML, footHTML) {
  var modal = document.getElementById("modal");
  if (!modal) return;
  modal.innerHTML = 
    '<div class="mhead">' + title + '<button id="mx" aria-label="Close">&times;</button></div>' +
    '<div class="mbody">' + bodyHTML + '</div>' +
    (footHTML ? '<div class="mfoot">' + footHTML + '</div>' : "");
  document.getElementById("modalBg").classList.add("show");
  document.getElementById("mx").addEventListener("click", closeModal);
}

function closeModal() {
  document.getElementById("modalBg").classList.remove("show");
}

function nextLeaveId() {
  return state.leave.reduce(function(max, l) { 
    return Math.max(max, l.id); 
  }, 0) + 1;
}

// Moves a pending request into approved leave (if approved) and removes it
// from the pending list either way. Returns the request that was actioned.
function applyLeaveDecision(id, approve) {
  var r = state.requests.find(function(x) { return x.id === id; });
  if (!r) return null;

  if (approve) {
    state.leave.push({ id: nextLeaveId(), name: r.name, type: r.type, year: r.year, month: r.month, day: r.day });
  }
  state.requests = state.requests.filter(function(x) { return x.id !== id; });
  return r;
}

function leaveColor(type) {
  return state.leaveTypes[type] || "#64748b";
}

function leaveOn(year, month, day) {
  return state.leave.filter(function(l) { 
    return l.year === year && l.month === month && l.day === day; 
  });
}

function reqDateLabel(r) {
  var m = months[r.month] || "";
  return r.endDay ? r.day + '–' + r.endDay + ' ' + m + ' ' + r.year : r.day + ' ' + m + ' ' + r.year;
}


/* =================================================================
   RENDER — Time Off page
   ================================================================= */

function renderTimeoff() {
  var main = document.getElementById("main");
  if (!main) {
    console.error("Main element not found");
    return;
  }

  main.innerHTML = 
    '<div class="page-head">' +
      '<div class="eyebrow">People</div>' +
      '<div class="page-title">Time Off &amp; Leave</div>' +
      '<div class="page-sub">Approve requests and manage the team leave calendar.</div>' +
    '</div>' +
    '<div class="tabs">' +
      '<button class="tab ' + (state.timeoffTab === "pending" ? "active" : "") + '" data-tab="pending">Pending Requests (' + state.requests.length + ')</button>' +
      '<button class="tab ' + (state.timeoffTab === "calendar" ? "active" : "") + '" data-tab="calendar">Leave Calendar</button>' +
    '</div>' +
    '<div id="toBody"></div>';

  document.querySelectorAll(".tab[data-tab]").forEach(function(tab) {
    tab.onclick = function() {
      state.timeoffTab = tab.dataset.tab;
      renderTimeoff();
    };
  });

  var body = document.getElementById("toBody");
  if (state.timeoffTab === "pending") {
    body.innerHTML = renderPending();
    wirePending();
  } else {
    body.innerHTML = renderCalendar();
    wireCalendar();
  }
}

/* ---- Pending requests tab ---- */
function renderPending() {
  if (!state.requests || state.requests.length === 0) {
    return '<div class="req-card"><div class="empty">No pending requests. You are all caught up!</div></div>';
  }

  return '<div class="req-card">' + state.requests.map(function(r) {
    return '<div class="req">' +
      '<div class="who">' +
        '<b>' + r.name + '</b>' +
        '<span style="color:var(--muted)">· ' + r.type + ' · ' + reqDateLabel(r) + ' · ' + r.dept + '</span>' +
      '</div>' +
      '<div class="row-actions">' +
        '<button class="btn sm" data-action="approve" data-id="' + r.id + '"> Approve</button>' +
        '<button class="btn sm red" data-action="deny" data-id="' + r.id + '"> Deny</button>' +
      '</div>' +
    '</div>';
  }).join("") + '</div>';
}

function wirePending() {
  document.querySelectorAll('[data-action="approve"], [data-action="deny"]').forEach(function(btn) {
    btn.onclick = function() {
      var id = parseInt(btn.dataset.id);
      var approve = btn.dataset.action === "approve";
      var r = applyLeaveDecision(id, approve);
      if (r) {
        toast((approve ? " Approved" : " Denied") + ": " + r.name + " — " + r.type);
        renderTimeoff();
      }
    };
  });
}

/* ---- Leave calendar tab ---- */
function renderCalendar() {
  var y = state.calYear;
  var m = state.calMonth;
  var first = new Date(y, m, 1).getDay();
  var days = new Date(y, m + 1, 0).getDate();

  var cells = "";
  for (var i = 0; i < first; i++) {
    cells += '<div class="cal-cell muted"></div>';
  }

  for (var d = 1; d <= days; d++) {
    var entries = leaveOn(y, m, d);
    var chips = entries.slice(0, 3).map(function(l) {
      return '<span class="chip" style="background:' + leaveColor(l.type) + ';font-size:10px;padding:2px 6px;border-radius:3px;color:#fff;display:inline-block;margin:1px 0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + l.name + ' — ' + l.type + '">' +
        l.name.split(" ")[0] + ' · ' + l.type.split(" ")[0] +
      '</span>';
    }).join("");

    var hasMore = entries.length > 3;
    cells += '<div class="cal-cell clickable" data-day="' + d + '" style="' + (entries.length ? "background:rgba(var(--primary-rgb,59,130,246),0.05)" : "") + '">' +
      '<span class="cal-num">' + d + '</span>' +
      chips +
      (hasMore ? '<span style="font-size:9px;color:var(--muted)">+' + (entries.length - 3) + ' more</span>' : "") +
    '</div>';
  }

  var dows = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(function(d) { 
    return '<div class="dow">' + d + '</div>'; 
  }).join("");

  return '<div>' +
    '<div class="cal-head">' +
      '<div style="display:flex;gap:8px;align-items:center">' +
        '<button class="cal-nav" data-cal="prev">‹</button>' +
        '<button class="cal-nav" data-cal="next">›</button>' +
        '<button class="btn line sm" data-cal="today">Today</button>' +
      '</div>' +
      '<span class="mname">' + MONTHS_LONG[m] + ' ' + y + '</span>' +
      '<span style="width:36px"></span>' +
    '</div>' +
    '<div class="cal-grid">' + dows + cells + '</div>' +
    '<p style="color:var(--muted);font-size:13px;margin-top:10px"> Click any day to add or remove leave.</p>' +
  '</div>';
}

function wireCalendar() {
  document.querySelectorAll("[data-cal]").forEach(function(btn) {
    btn.onclick = function() {
      var action = btn.dataset.cal;
      if (action === "prev") {
        state.calMonth--;
        if (state.calMonth < 0) { state.calMonth = 11; state.calYear--; }
      } else if (action === "next") {
        state.calMonth++;
        if (state.calMonth > 11) { state.calMonth = 0; state.calYear++; }
      } else if (action === "today") {
        var now = new Date();
        state.calMonth = now.getMonth();
        state.calYear = now.getFullYear();
      }
      renderTimeoff();
    };
  });

  document.querySelectorAll(".cal-cell.clickable").forEach(function(cell) {
    cell.onclick = function() { 
      openDay(state.calYear, state.calMonth, parseInt(cell.dataset.day)); 
    };
  });
}

/* ---- Day editor modal ---- */
function openDay(year, month, day) {
  function getBody() {
    var entries = leaveOn(year, month, day);
    var typeOptions = Object.keys(state.leaveTypes).map(function(t) { 
      return '<option value="' + t + '">' + t + '</option>'; 
    }).join("");

    var list = entries.length
      ? entries.map(function(l) {
          return '<div class="line" style="padding:6px 0">' +
            '<span>' +
              '<span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:' + leaveColor(l.type) + ';margin-right:8px"></span>' +
              '<b>' + l.name + '</b> — ' + l.type +
            '</span>' +
            '<button class="btn red sm" data-action="remove" data-id="' + l.id + '">Remove</button>' +
          '</div>';
        }).join("")
      : '<p style="color:var(--muted);font-size:14px;padding:6px 0">No leave booked on this day.</p>';

    return 
      '<div style="margin-bottom:12px">' + list + '</div>' +
      '<label style="font-weight:600;font-size:14px;display:block;margin-top:12px">Add leave</label>' +
      '<input class="field" id="d_name" placeholder="Employee name" style="margin-bottom:8px">' +
      '<select class="select" id="d_type" style="width:100%">' + typeOptions + '</select>';
  }

  openModal(
    MONTHS_LONG[month] + ' ' + day + ', ' + year,
    getBody(),
    '<button class="btn ghost" id="mclose">Close</button><button class="btn green" id="dAdd">+ Add leave</button>'
  );

  function refreshModal() {
    var bodyEl = document.querySelector(".mbody");
    if (bodyEl) {
      bodyEl.innerHTML = getBody();
      wireModalEvents(year, month, day, refreshModal);
    }
  }

  wireModalEvents(year, month, day, refreshModal);
}

function wireModalEvents(year, month, day, refreshFn) {
  var closeBtn = document.getElementById("mclose");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  var addBtn = document.getElementById("dAdd");
  if (addBtn) {
    addBtn.addEventListener("click", function() {
      var nameInput = document.getElementById("d_name");
      var typeSelect = document.getElementById("d_type");
      if (!nameInput || !typeSelect) return;

      var name = nameInput.value.trim();
      var type = typeSelect.value;

      if (!name) {
        toast("Please enter an employee name");
        nameInput.focus();
        return;
      }

      var exists = state.leave.some(function(l) {
        return l.name === name && l.type === type && l.year === year && l.month === month && l.day === day;
      });
      if (exists) {
        toast(" This leave entry already exists");
        return;
      }

      state.leave.push({ id: nextLeaveId(), name: name, type: type, year: year, month: month, day: day });
      refreshFn();
      renderTimeoff();
      toast(" Added " + type + " for " + name);
    });
  }

  document.querySelectorAll('[data-action="remove"]').forEach(function(btn) {
    btn.onclick = function() {
      state.leave = state.leave.filter(function(l) { 
        return l.id !== parseInt(btn.dataset.id); 
      });
      refreshFn();
      renderTimeoff();
      toast(" Removed leave entry");
    };
  });
}


/* =================================================================
   BOOT
   ================================================================= */

document.addEventListener("DOMContentLoaded", async function() {
  // Close the modal via backdrop click or Escape.
  var modalBg = document.getElementById("modalBg");
  if (modalBg) {
    modalBg.addEventListener("click", function(e) {
      if (e.target.id === "modalBg") closeModal();
    });
  }

  await loadData();
  initState();
  renderTimeoff();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

// Exposed globally in case other pages/scripts need to read or re-render state.
window.renderTimeoff = renderTimeoff;
window.state = state;