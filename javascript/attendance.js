/* ATTENDANCE MANAGEMENT SCRIPT
   This file powers the "Attendance Management" page.
   It loads employee attendance data from JSON,
   renders a dashboard with KPIs, a bar chart,
   and a detailed attendance table. */

/* Navigation configuration */
// Defines all main menu items (used in the top bar and mobile nav).
const NAV = [
  { id: "dashboard", label: "Dashboard" },
  { id: "employees", label: "Employees" },
  { id: "time_off", label: "Time Off Management" },
  { id: "attendance", label: "Attendance Management" },
  { id: "payroll_payslips", label: "Payroll and Payslips" },
  { id: "performance_review", label: "Performance Reviews" },
];

// Builds the URL for a given page ID (simply appends ".html").
function pageUrl(id) {
  return id + ".html";
}

/* Top bar HTML generation */
// Generates the complete top bar markup based on the currently active page.
function topbarHTML(active) {
  // SVG icon for the company logo.
  const logo = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M6 21V9l6-4 6 4v12M10 21v-5h4v5"/></svg>';
  
  // Build navigation links, marking the active one with the "active" class.
  const links = NAV.map(function(n) {
    return '<a class="topnav-item ' + (n.id === active ? 'active' : '') + '" href="' + pageUrl(n.id) + '">' + n.label + '</a>';
  }).join("");

  // Return the complete HTML for the topbar.
  return `
    <a class="tb-brand" href="${pageUrl('dashboard')}"><span class="tb-logo">${logo}</span><span class="tb-name">ModernTech HR</span></a>
    <button class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle navigation">
      <i class="bi bi-list"></i>
    </button>
    <nav class="topnav">${links}</nav>
    <div class="top-spacer"></div>
    <div class="top-icons">
      <!-- Theme toggle button -->
      <button class="icon-btn" id="themeBtn"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button>
      <!-- User profile button -->
      <button class="acct" id="profileBtn"><span class="av">HA</span><span class="who"><b>HR Admin</b><span>HR Manager</span></span></button>
    </div>
    <!-- Dropdown profile menu -->
    <div class="menu" id="profileMenu">
      <button id="goProfile">My profile</button>
      <div class="sep"></div>
      <button id="logoutBtn">Log out</button>
    </div>
  `;
}

// Determine the current page from the <body>'s data-page attribute (default: "attendance").
var active = document.body.dataset.page || "attendance";
var tb = document.getElementById("topbar");
if (tb) tb.innerHTML = topbarHTML(active);

/* Mobile navigation */
// Creates a sliding mobile navigation panel that appears when the hamburger is clicked.
function createMobileNav() {
  var nav = document.createElement('div');
  nav.className = 'mobile-nav';
  nav.id = 'mobileNav';
  
  // Populate with the same navigation links.
  nav.innerHTML = NAV.map(function(n) {
    return '<a class="mobile-nav-item ' + (n.id === active ? 'active' : '') + '" href="' + pageUrl(n.id) + '">' + n.label + '</a>';
  }).join('');
  
  document.body.appendChild(nav);
  
  // Close the nav when any link is clicked.
  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
    });
  });
  
  return nav;
}

var mobileNav = createMobileNav();

// Toggle mobile nav when the hamburger button is clicked.
var hamburgerBtn = document.getElementById('hamburgerBtn');
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    mobileNav.classList.toggle('open');
  });
}

// Close the mobile nav when clicking outside of it.
document.addEventListener('click', function(e) {
  if (!e.target.closest('.hamburger-btn') && !e.target.closest('.mobile-nav')) {
    mobileNav.classList.remove('open');
  }
});

// Close mobile nav on scroll (with a small delay to avoid performance issues).
var scrollTimeout;
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function() {
    mobileNav.classList.remove('open');
  }, 100);
});

/*  Theme (dark/light) management  */
// Persists the user's theme preference in localStorage.
var THEME_KEY = "mt-theme";

function currentTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || "light";
  } catch(e) {
    return "light";
  }
}

// Applies the chosen theme by setting a data attribute on the <html> element,
// and updates the theme button icon.
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch(e) {}
  updateThemeIcon(t);
}

// Swaps the theme button icon between sun and moon.
function updateThemeIcon(t) {
  var btn = document.getElementById("themeBtn");
  if (!btn) return;
  var isDark = t === "dark";
  btn.innerHTML = isDark
    ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
    : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  btn.title = isDark ? "Switch to light mode" : "Switch to dark mode";
}

// Restore saved theme when the page loads.
applyTheme(currentTheme());

// Toggle theme when the theme button is clicked.
var themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  themeBtn.addEventListener("click", function() {
    applyTheme(currentTheme() === "dark" ? "light" : "dark");
  });
}

/*  Profile menu (dropdown) */
// Clicking the profile avatar toggles the dropdown menu.
var profileBtn = document.getElementById("profileBtn");
if (profileBtn) {
  profileBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("show");
  });
}

// Placeholder action for "My profile".
var goProfileBtn = document.getElementById("goProfile");
if (goProfileBtn) {
  goProfileBtn.addEventListener("click", function() {
    alert("Profile");
  });
}

// Logout: redirect to the login page.
var logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    location.href = "index.html";
  });
}

// Close the profile menu when clicking anywhere else on the page.
document.addEventListener("click", function() {
  var menu = document.getElementById("profileMenu");
  if (menu) menu.classList.remove("show");
});

/* DATA LOADING AND STATE BUILDING */

// These global variables will hold the raw loaded data.
var ATTENDANCE_LEAVE = [];
var PAYROLL = {};
var EMP_META = {};

// Static department definitions – each has a name and a colour for UI consistency.
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

// Lookup object for quick department colour access.
var DEPT_COLOR = {};
DEPARTMENTS.forEach(function(d) {
  DEPT_COLOR[d.name] = d.color;
});

// A pool of avatar colours – we assign one based on employee ID.
var AVATAR_COLORS = ["#1d4ed8","#2563eb","#0ea5e9","#6366f1","#0891b2","#3b82f6","#4f46e5","#7c3aed","#0284c7","#4338ca"];

// Short month names for display.
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Parse a "YYYY-MM-DD" string into an object with {y, m, d} (month is 0-indexed).
function parseDate(s) {
  var parts = s.split("-").map(Number);
  return { y: parts[0], m: parts[1] - 1, d: parts[2] };
}

/* Building the employee list and computed statistics */
// These variables will hold the processed data and UI state.
var employees = [];
var deptCounts = {};
var statusCounts = {};
var dayLabels = [];
var dailyPresent = [];
var attendanceRate = 0;
var state = {};

// Transforms the raw attendance, payroll, and employee info into a clean employee array
// and computes KPIs like department headcount, daily present count, etc.
function buildState() {
  // 1. Build the employee list from ATTENDANCE_LEAVE.
  employees = ATTENDANCE_LEAVE.map(function(rec) {
    var id = rec.employeeId;
    var meta = EMP_META[id] || { dept: "Operations", role: "Team Member" };
    var pay = PAYROLL[id] || { hoursWorked: 160, leaveDeductions: 0, finalSalary: 0 };
    var nameParts = rec.name.split(" ");
    var first = nameParts[0];
    var last = nameParts.slice(1).join(" ");

    return {
      id: id,
      name: rec.name,
      first: first,
      last: last,
      role: meta.role,
      dept: meta.dept,
      deptColor: DEPT_COLOR[meta.dept] || "#1d4ed8",
      avatar: AVATAR_COLORS[id % AVATAR_COLORS.length],
      attendanceLog: rec.attendance || []
    };
  });

  // 2. Department headcounts.
  deptCounts = {};
  DEPARTMENTS.forEach(function(d) {
    deptCounts[d.name] = 0;
  });
  employees.forEach(function(e) {
    if (deptCounts[e.dept] != null) deptCounts[e.dept]++;
  });

  // 3. Status counts (simplified – we only use "Active" here for demo).
  // The original code had statusCounts but never set employee.status, so we'll
  // keep it for compatibility but it may not reflect actual data.
  statusCounts = { "Active": 0, "Remote": 0, "On Leave": 0 };
  employees.forEach(function(e) {
    // In this version, we don't have a 'status' field on employees,
    // so we just count everyone as Active.
    statusCounts["Active"]++;
  });

  // 4. Daily present headcount – we need a common list of dates.
  // Assume the first employee has a full set of dates.
  var attDates = ATTENDANCE_LEAVE[0].attendance.map(function(a) { return a.date; });
  dayLabels = attDates.map(function(d) {
    var p = parseDate(d);
    return p.d + " " + months[p.m];
  });

  dailyPresent = attDates.map(function(date) {
    return employees.reduce(function(n, e) {
      var found = e.attendanceLog.find(function(a) { return a.date === date; });
      return n + (found && found.status === "Present" ? 1 : 0);
    }, 0);
  });

  // 5. Overall attendance rate (percentage).
  var totalPresent = employees.reduce(function(n, e) {
    return n + e.attendanceLog.filter(function(a) { return a.status === "Present"; }).length;
  }, 0);
  var totalPossible = employees.length * attDates.length;
  attendanceRate = totalPossible > 0 ? Math.round((totalPresent / totalPossible) * 100) : 0;

  // 6. Store everything in the global state object.
  state = {
    employees: employees,
    departments: DEPARTMENTS,
    deptCounts: deptCounts,
    statusCounts: statusCounts,
    months: dayLabels,
    attendance: dailyPresent,
    attendanceRate: attendanceRate
  };
}

/* Loading data from JSON files */
// Fetches attendance.json, employee_info.json, and payroll_data.json.
// On success, builds the state; on failure, shows an error message.
async function loadData() {
  try {
    var [attRes, empRes, payRes] = await Promise.all([
      fetch("data/attendance.json"),
      fetch("data/employee_info.json"),
      fetch("data/payroll_data.json")
    ]);

    if (!attRes.ok || !empRes.ok || !payRes.ok) {
      throw new Error("Failed to load data files");
    }

    var attendanceData = await attRes.json();
    var employeeInfoData = await empRes.json();
    var payrollData = await payRes.json();

    // Parse the data – handle different possible JSON structures.
    ATTENDANCE_LEAVE = attendanceData.attendanceAndLeave || attendanceData.attendance || [];
    PAYROLL = payrollData.payroll || payrollData || {};

    // Build EMP_META from employee_info.json.
    EMP_META = {};
    var employeesList = employeeInfoData.employeeInformation || employeeInfoData.employees || [];
    employeesList.forEach(function(emp) {
      EMP_META[emp.employeeId] = {
        dept: emp.department || "Unknown",
        role: emp.position || "Team Member"
      };
    });

    buildState();
    return true;

  } catch (err) {
    console.error("Error loading data:", err);
    var main = document.getElementById("main");
    if (main) {
      main.innerHTML =
        '<div class="no-results" style="padding: 40px; text-align: center;">' +
          '<h2>Could not load data</h2>' +
          '<p>Make sure the data files are in the <code>data/</code> folder.</p>' +
          '<p style="color: var(--muted); font-size: 14px; margin-top: 8px;">Error: ' + err.message + '</p>' +
          '<button onclick="location.reload()" style="margin-top: 20px; padding: 10px 24px; border: none; border-radius: 8px; background: #3b82f6; color: white; cursor: pointer; font-weight: 600;">Retry</button>' +
        '</div>';
    }
    return false;
  }
}

/* UI HELPERS */

// Shorthand DOM selectors.
function $(s) { return document.querySelector(s); }
function $$(s) { return Array.from(document.querySelectorAll(s)); }

// Returns the initials (first two letters) from a full name.
function initials(name) {
  return name.split(" ").map(function(w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
}

// Renders an avatar circle with the employee's initials and a background colour.
function avatar(e, cls) {
  cls = cls || "";
  return '<span class="avatar ' + cls + '" style="background:' + (e.avatar || e.deptColor || '#1d4ed8') + '">' + initials(e.name) + '</span>';
}

// Shows a transient toast notification.
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

/* SVG bar chart generator */
// Creates an SVG bar chart inside the given container.
// values: array of numbers; labels: array of corresponding labels; opts: optional settings.
function barSVG(values, labels, opts) {
  opts = opts || {};
  var w = opts.w || 560;
  var h = opts.h || 240;
  var padL = 34, padB = 26, padT = 10, padR = 6;
  var max = opts.max || Math.ceil(Math.max.apply(null, values) / 50) * 50 || 10;
  var plotW = w - padL - padR;
  var plotH = h - padT - padB;
  var n = values.length;
  var gap = plotW / n;
  var bw = Math.min(30, gap * 0.5);

  // Build grid lines and y‑axis labels.
  var grid = "";
  var yl = "";
  for (var i = 0; i <= 4; i++) {
    var y = padT + plotH - (plotH * i / 4);
    var val = Math.round(max * i / 4);
    grid += '<line x1="' + padL + '" y1="' + y + '" x2="' + (w - padR) + '" y2="' + y + '" class="grid-line"/>';
    yl += '<text x="' + (padL - 6) + '" y="' + (y + 3) + '" text-anchor="end" class="axis-label">' + val + '</text>';
  }

  // Build each bar (rect + label).
  var bars = values.map(function(v, i) {
    var bh = (v / max) * plotH;
    var x = padL + gap * i + (gap - bw) / 2;
    var y = padT + plotH - bh;
    var col = opts.color || "url(#barGrad)";
    return '<g class="bar"><rect x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="5" fill="' + col + '"><title>' + labels[i] + ': ' + v + '</title></rect><text x="' + (x + bw/2) + '" y="' + (h - 8) + '" text-anchor="middle" class="axis-label">' + labels[i] + '</text></g>';
  }).join("");

  // Assemble the full SVG.
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" class="barchart" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1d4ed8"/></linearGradient></defs>' + grid + yl + bars + '</svg>';
}

/* RENDER THE ATTENDANCE PAGE */

// This is the main rendering function – it builds the entire attendance dashboard
// using the data stored in the global `state` object.
function renderAttendance() {
  var emps = state.employees;

  // If there are no employees, show a friendly error message.
  if (!emps || emps.length === 0) {
    document.getElementById("main").innerHTML =
      '<div class="no-results" style="padding: 40px; text-align: center;">' +
        '<h2>No employee data available</h2>' +
        '<p>Please check your data files.</p>' +
      '</div>';
    return;
  }

  // Extract the list of dates from the first employee's attendance log.
  var dates = emps[0].attendanceLog.map(function(a) { return a.date; });
  var dayHeads = state.months; // pre‑formatted day labels (e.g. "1 Jan", "2 Jan", ...)

  // Compute some KPIs.
  var totalCells = emps.length * dates.length;
  var totalPresent = emps.reduce(function(n, e) {
    return n + e.attendanceLog.filter(function(a) { return a.status === "Present"; }).length;
  }, 0);
  var totalAbsent = totalCells - totalPresent;
  var avgPerDay = Math.round(state.attendance.reduce(function(a, b) { return a + b; }, 0) / dates.length);
  var onLeave = state.statusCounts["On Leave"] || 0;

  // Helper to generate a dot (P or A) for each attendance record.
  function dot(st) {
    return st === "Present"
      ? '<span class="att-dot present" title="Present">P</span>'
      : '<span class="att-dot absent" title="Absent">A</span>';
  }

  // Build the table rows for each employee.
  var bodyRows = emps.map(function(e) {
    var present = e.attendanceLog.filter(function(a) { return a.status === "Present"; }).length;
    var rate = Math.round(present / dates.length * 100);
    var cells = dates.map(function(d) {
      var rec = e.attendanceLog.find(function(a) { return a.date === d; });
      return '<td class="att-cell">' + (rec ? dot(rec.status) : "—") + '</td>';
    }).join("");
    return '<tr>' +
      '<td class="att-emp"><div class="who-cell">' + avatar(e) + '<div style="min-width:0"><div class="nm">' + e.name + '</div><div class="rl">' + e.role + '</div></div></div></td>' +
      '<td class="col-hide"><span class="pill dept">' + e.dept + '</span></td>' +
      cells +
      '<td class="att-num">' + present + '/' + dates.length + '</td>' +
      '<td class="att-num"><b>' + rate + '%</b></td>' +
    '</tr>';
  }).join("");

  // Inject the full page HTML into the #main container.
  document.getElementById("main").innerHTML =
    // Page header
    '<div class="page-head">' +
      '<div class="eyebrow">Operations</div>' +
      '<div class="page-title">Attendance Management</div>' +
      '<div class="page-sub">Daily attendance across the team · ' + dayHeads[0] + ' – ' + dayHeads[dayHeads.length - 1] + ' 2025</div>' +
    '</div>' +

    // KPI cards
    '<div class="kpis">' +
      '<div class="kpi"><div class="klab">Attendance Rate</div><div class="kval">' + state.attendanceRate + '%</div><span class="ktrend up">team average</span></div>' +
      '<div class="kpi"><div class="klab">Avg Present / Day</div><div class="kval">' + avgPerDay + '<span style="font-size:15px;color:var(--muted)"> / ' + emps.length + '</span></div></div>' +
      '<div class="kpi"><div class="klab">Total Absences</div><div class="kval">' + totalAbsent + '</div><span class="ktrend">over ' + dates.length + ' days</span></div>' +
      '<div class="kpi"><div class="klab">On Leave</div><div class="kval">' + onLeave + '</div></div>' +
    '</div>' +

    // Bar chart panel
    '<div class="panel" style="margin-bottom:20px">' +
      '<div class="panel-title"><h3>Daily Present Headcount</h3><span class="hint">People on-site each day</span></div>' +
      barSVG(state.attendance, dayHeads, {max: emps.length}) +
    '</div>' +

    // Attendance table (scrollable wrapper)
    '<div class="card att-wrap">' +
      '<div class="att-scroll">' +
        '<table class="att-table">' +
          '<thead><tr>' +
            '<th class="att-emp">Employee</th>' +
            '<th class="col-hide">Department</th>' +
            dayHeads.map(function(d) { return '<th class="att-cell">' + d + '</th>'; }).join("") +
            '<th class="att-num">Present</th>' +
            '<th class="att-num">Rate</th>' +
          '</tr></thead>' +
          '<tbody>' + bodyRows + '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';
}

/* BOOT – Start the application */

// When the DOM is ready, load the data and render the page.
document.addEventListener("DOMContentLoaded", async function() {
  var success = await loadData();
  if (success) {
    renderAttendance();
  }
});