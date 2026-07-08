console.log("Employees JS Loaded");

/* ==================================================
   NAVIGATION
   Creates the navigation menu structure and handles
   generating links for different HR system pages.
================================================== */

const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "employees", label: "Employees" },
    { id: "time_off", label: "Time Off Management" },
    { id: "attendance", label: "Attendance Management" },
    { id: "payroll_payslips", label: "Payroll and Payslips" },
    { id: "performance_review", label: "Performance Reviews" }
];

// Creates the URL path for each navigation page
function pageUrl(id) {
    return `${id}.html`;
}

// ================================
// SVG ICONS
// ================================
function buildingIcon() {
    return `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">

            <path d="M3 21h18"/>
            <path d="M6 21V9l6-4 6 4v12"/>
            <path d="M10 21v-5h4v5"/>

        </svg>
    `;
}

function moonIcon() {
    return `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>

        </svg>
    `;
}

function sunIcon() {
    return `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2">

            <circle cx="12" cy="12" r="4"/>

            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>

            <path d="M4.9 4.9l1.4 1.4"/>
            <path d="M17.7 17.7l1.4 1.4"/>

            <path d="M4.9 19.1l1.4-1.4"/>
            <path d="M17.7 6.3l1.4-1.4"/>

        </svg>
    `;
}

function menuIcon() {
    return `
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round">

            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>

        </svg>
    `;
}

// Generates the HTML structure for the top navigation bar
function topbarHTML(active) {

    // Creates navigation links and highlights the active page
    const links = NAV.map(item => `
        <a
            class="topnav-item ${item.id === active ? "active" : ""}"
            href="${pageUrl(item.id)}"
        >
            ${item.label}
        </a>
    `).join("");

    // Returns the complete topbar layout
    return `
        <a class="tb-brand" href="${pageUrl("dashboard")}">
            <span class="tb-logo">
    ${buildingIcon()}
</span>

            <span class="tb-name">ModernTech HR</span>
        </a>

        <nav class="topnav">
            ${links}
        </nav>

       <button class="hamburger-btn" id="hamburgerBtn">
    ${menuIcon()}
</button>

        <div class="top-spacer"></div>

        <div class="top-icons">

            <button
    class="icon-btn"
    id="themeBtn"
>
    ${sunIcon()}
</button>

            <button class="acct">

                <span class="av">HA</span>

                <span class="who">
                    <b>HR Admin</b>
                    <span>HR Manager</span>
                </span>

            </button>

        </div>
    `;
}



// Gets the current page name from the body data attribute
const activePage =
    document.body.dataset.page || "employees";

// Finds the topbar element where navigation will be inserted
const topbar =
    document.getElementById("topbar");

// Inserts the generated navigation into the page
if (topbar) {
    topbar.innerHTML =
        topbarHTML(activePage);
}


/* ==================================================
   MOBILE NAV
   Creates and controls the mobile navigation menu
   for smaller screen devices.
================================================== */

// Creates the mobile navigation menu dynamically
function createMobileNav() {

    const nav =
        document.createElement("div");

    nav.className = "mobile-nav";
    nav.id = "mobileNav";

    // Adds navigation links to the mobile menu
    nav.innerHTML = NAV.map(item => `

        <a
            class="mobile-nav-item ${item.id === activePage ? "active" : ""}"
            href="${pageUrl(item.id)}"
        >
            ${item.label}
        </a>

    `).join("");

    // Adds the mobile navigation menu to the page
    document.body.appendChild(nav);

    return nav;
}

// Creates the mobile navigation element
const mobileNav =
    createMobileNav();

// Finds the hamburger menu button
const hamburgerBtn =
    document.getElementById("hamburgerBtn");

// Opens and closes the mobile navigation when clicked
if (hamburgerBtn) {

    hamburgerBtn.addEventListener("click", e => {

        e.stopPropagation();

        mobileNav.classList.toggle("open");

    });

}

// Closes the mobile menu when clicking outside of it
document.addEventListener("click", e => {

    if (
        !e.target.closest(".hamburger-btn") &&
        !e.target.closest(".mobile-nav")
    ) {

        mobileNav.classList.remove("open");

    }

});


/* ==================================================
   THEME
   Handles switching between light and dark mode
   and saving the selected theme.
================================================== */

const THEME_KEY = "mt-theme";

// Retrieves the saved theme preference from storage
function currentTheme() {

    try {

        return (
            localStorage.getItem(THEME_KEY) ||
            "light"
        );

    } catch {

        return "light";

    }

}

// Applies the saved theme when the page loads
function applyTheme(theme) {

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    try {

        localStorage.setItem(
            THEME_KEY,
            theme
        );

    } catch {}

    updateThemeIcon(theme);

}

function updateThemeIcon(theme) {

    const themeBtn =
        document.getElementById("themeBtn");

    if (!themeBtn) return;

    themeBtn.innerHTML =
        theme === "dark"
            ? sunIcon()
            : moonIcon();
}


/* ==================================================
   ELEMENTS
   Stores references to HTML elements used by JavaScript
   for updating content and handling user actions.
================================================== */

const employeeContainer =
    document.getElementById("employeeContainer");

const searchInput =
    document.getElementById("searchInput");

const departmentFilter =
    document.getElementById("departmentFilter");

const totalEmployees =
    document.getElementById("totalEmployees");

const totalDepartments =
    document.getElementById("totalDepartments");

const averageSalary =
    document.getElementById("averageSalary");

const employeeModal =
    document.getElementById("employeeModal");

const modalContent =
    document.getElementById("modalContent");

const closeModal =
    document.getElementById("closeModal");

const editModal =
    document.getElementById("editModal");

const closeEditModal =
    document.getElementById("closeEditModal");

const saveEmployeeBtn =
    document.getElementById("saveEmployeeBtn");

const editName =
    document.getElementById("editName");

const editPosition =
    document.getElementById("editPosition");

const editDepartment =
    document.getElementById("editDepartment");

const editContact =
    document.getElementById("editContact");

const editSalary =
    document.getElementById("editSalary");


/* ==================================================
   DATA
   Stores employee information and tracks the selected
   employee being edited.
================================================== */

let employees = [];
let currentEmployeeId = null;


/* ==================================================
   HELPERS
   Contains reusable utility functions used throughout
   the application.
================================================== */

// Converts an employee name into initials for avatars
function getInitials(name) {

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

}

/* ==================================================
   STATS
   Calculates and updates employee statistics displayed
   on the dashboard.
================================================== */

function updateStatistics() {

    // Updates the total number of employees
    totalEmployees.textContent =
        employees.length;

    // Creates a list of unique departments from employee data
    const departments =
        [...new Set(
            employees.map(emp => emp.department)
        )];

    // Displays the total number of departments
    totalDepartments.textContent =
        departments.length;

    // Calculates the average salary of all employees
    const average =
        employees.reduce(
            (sum, emp) => sum + emp.salary,
            0
        ) / employees.length;

    // Displays the formatted average salary value
    averageSalary.textContent =
        "R" + Math.round(average).toLocaleString();

}


/* ==================================================
   DEPARTMENTS
   Populates the department filter dropdown using
   available employee department data.
================================================== */

function populateDepartments() {

    // Gets all unique departments from employee records
    const departments =
        [...new Set(
            employees.map(emp => emp.department)
        )];

    // Resets the dropdown and adds the default option
    departmentFilter.innerHTML =
        '<option value="All">All Departments</option>';

    // Adds each department as a selectable option
    departments.forEach(department => {

        const option =
            document.createElement("option");

        option.value = department;
        option.textContent = department;

        departmentFilter.appendChild(option);

    });

}


/* ==================================================
   RENDER
   Displays employee information dynamically inside
   the employee table.
================================================== */

function renderEmployees(employeeList) {

    // Clears existing employee records before rendering new data
    employeeContainer.innerHTML = "";

    // Creates an employee row for every employee in the list
    employeeList.forEach(employee => {

        employeeContainer.innerHTML += `

        <div class="trow emp-grid">

            <div class="who-cell">

                <div class="avatar">
                    ${getInitials(employee.name)}
                </div>

                <div>

                    <div class="nm">
                        ${employee.name}
                    </div>

                    <div class="rl">
                        ID: ${employee.employeeId}
                    </div>

                </div>

            </div>

            <div>
                <span class="pill dept">
                    ${employee.department}
                </span>
            </div>

            <div>${employee.position}</div>

            <div>${employee.contact}</div>

            <div class="row-actions">

                <!-- Opens the employee details modal -->
                <button
                    class="btn sm ghost"
                    onclick="viewEmployee(${employee.employeeId})"
                >
                    View
                </button>

                <!-- Opens the employee editing modal -->
                <button
                    class="btn sm"
                    onclick="editEmployee(${employee.employeeId})"
                >
                    Edit
                </button>

            </div>

        </div>

        `;

    });

}


/* ==================================================
   VIEW
   Displays complete employee information inside a modal.
================================================== */

function viewEmployee(id) {

    // Finds the selected employee using their ID
    const employee =
        employees.find(
            emp => emp.employeeId === id
        );

    // Stops execution if no employee is found
    if (!employee) return;

    // Inserts employee information into the modal
    modalContent.innerHTML = `

        <div class="line"><span>ID</span><strong>${employee.employeeId}</strong></div>
        <div class="line"><span>Name</span><strong>${employee.name}</strong></div>
        <div class="line"><span>Position</span><strong>${employee.position}</strong></div>
        <div class="line"><span>Department</span><strong>${employee.department}</strong></div>
        <div class="line"><span>Salary</span><strong>R${employee.salary.toLocaleString()}</strong></div>
        <div class="line"><span>Contact</span><strong>${employee.contact}</strong></div>
        <div class="line"><span>History</span><strong>${employee.employmentHistory}</strong></div>

    `;

    // Displays the employee information modal
    employeeModal.classList.add("show");

}


/* ==================================================
   EDIT
   Loads selected employee details into the edit form.
================================================== */

function editEmployee(id) {

    // Finds the employee that matches the selected ID
    const employee =
        employees.find(
            emp => emp.employeeId === id
        );

    // Stops execution if no employee exists
    if (!employee) return;

    // Stores the current employee being edited
    currentEmployeeId = id;

    // Loads employee information into the edit fields
    editName.value = employee.name;
    editPosition.value = employee.position;
    editDepartment.value = employee.department;
    editContact.value = employee.contact;
    editSalary.value = employee.salary;

    // Opens the edit modal
    editModal.classList.add("show");

}


/* ==================================================
   SAVE
   Updates employee details after editing and refreshes
   the displayed employee information.
================================================== */

saveEmployeeBtn.addEventListener("click", () => {

    // Finds the employee currently being edited
    const employee =
        employees.find(
            emp => emp.employeeId === currentEmployeeId
        );

    // Stops execution if employee is not found
    if (!employee) return;

    // Updates employee information with edited values
    employee.name = editName.value;
    employee.position = editPosition.value;
    employee.department = editDepartment.value;
    employee.contact = editContact.value;
    employee.salary = Number(editSalary.value);

    // Refreshes the employee list and statistics
    renderEmployees(employees);
    updateStatistics();

    // Closes the edit modal after saving changes
    editModal.classList.remove("show");

});


/* ==================================================
   FILTER
   Filters employees based on search input and selected
   department.
================================================== */

function filterEmployees() {

    // Gets the search text entered by the user
    const search =
        searchInput.value.toLowerCase();

    // Gets the selected department filter value
    const department =
        departmentFilter.value;

    // Filters employees based on matching information
    let filtered =
        employees.filter(employee =>

            employee.name.toLowerCase().includes(search) ||
            employee.position.toLowerCase().includes(search) ||
            employee.department.toLowerCase().includes(search) ||
            employee.contact.toLowerCase().includes(search)

        );

    // Applies department filtering if a specific department is selected
    if (department !== "All") {

        filtered =
            filtered.filter(
                employee =>
                    employee.department === department
            );

    }

    // Displays the filtered employee results
    renderEmployees(filtered);

}

// Runs filtering when the user types in the search field
searchInput.addEventListener(
    "input",
    filterEmployees
);

// Runs filtering when the department selection changes
departmentFilter.addEventListener(
    "change",
    filterEmployees
);


/* ==================================================
   MODALS
   Controls opening and closing of modal windows.
================================================== */

// Closes the employee details modal
closeModal.addEventListener("click", () => {
    employeeModal.classList.remove("show");
});

// Closes the employee edit modal
closeEditModal.addEventListener("click", () => {
    editModal.classList.remove("show");
});


/* ==================================================
   LOAD JSON
   Loads employee information from an external JSON file
   and initializes the employee management page.
================================================== */

async function loadEmployees() {

    try {

        // Retrieves employee data from the JSON file
        const response =
            await fetch("data/employee_info.json");

        // Converts the response into JavaScript data
        const data =
            await response.json();

        // Stores employee information in the employees array
        employees =
            data.employeeInformation || [];

        // Initializes page data and displays employees
        populateDepartments();
        updateStatistics();
        renderEmployees(employees);

    }

    catch(error) {

        // Displays an error message if loading fails
        console.error(
            "Error loading employee data:",
            error
        );

    }

}

// Makes functions available globally for HTML button actions
window.viewEmployee = viewEmployee;
window.editEmployee = editEmployee;

/* ==================================================
   THEME BUTTON
================================================== */

// Apply saved theme when page loads
applyTheme(currentTheme());

// Toggle theme when button is clicked
const themeBtn =
    document.getElementById("themeBtn");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        const nextTheme =
            currentTheme() === "dark"
                ? "light"
                : "dark";

        applyTheme(nextTheme);

    });

}

// Starts loading employee data when the script runs
loadEmployees();