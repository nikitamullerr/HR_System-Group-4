console.log("Performance Review JS Loaded");

/* ==========================================
   NAVBAR
   Creates and manages the main navigation bar
   used throughout the HR system.
========================================== */

const NAV = [
    { id: "dashboard", label: "Dashboard" },
    { id: "employees", label: "Employees" },
    { id: "time_off", label: "Time Off Management" },
    { id: "attendance", label: "Attendance Management" },
    { id: "payroll_payslips", label: "Payroll and Payslips" },
    { id: "performance_review", label: "Performance Reviews" }
];

// Creates the URL for each navigation page
function pageUrl(id) {
    return id + ".html";
}

function buildingIcon() {
    return `
        <svg width="20" height="20"
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
        <svg width="20" height="20"
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
        <svg width="20" height="20"
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
        <svg width="20"
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

    // Creates navigation links and marks the current page as active
    const links = NAV.map(nav => `
        <a
            class="topnav-item ${nav.id === active ? "active" : ""}"
            href="${pageUrl(nav.id)}">
            ${nav.label}
        </a>
    `).join("");

    // Returns the complete navigation bar layout
    return `

        <a class="tb-brand" href="${pageUrl("dashboard")}">

            <span class="tb-logo">
    ${buildingIcon()}
</span>

            <span class="tb-name">
                ModernTech HR
            </span>

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

            <button
                class="acct"
                id="profileBtn">

                <span class="av">HA</span>

                <span class="who">

                    <b>HR Manager</b>
                    <span>Administrator</span>

                </span>

            </button>

        </div>

    `;
}

// Gets the active page from the HTML body data attribute
const activePage =
    document.body.dataset.page ||
    "performance_review";

// Finds the topbar container element
const topbar =
    document.getElementById("topbar");

// Inserts the generated navigation bar into the page
if(topbar){
    topbar.innerHTML =
        topbarHTML(activePage);
}


/* ==========================================
   MOBILE NAV
   Creates and controls the mobile navigation
   menu for smaller screen devices.
========================================== */

// Creates a mobile version of the navigation menu
function createMobileNav(){

    const nav =
        document.createElement("div");

    nav.className = "mobile-nav";

    // Generates mobile navigation links
    nav.innerHTML = NAV.map(item => `

        <a
            href="${pageUrl(item.id)}"
            class="
                mobile-nav-item
                ${item.id === activePage ? "active" : ""}
            ">

            ${item.label}

        </a>

    `).join("");

    // Adds the mobile menu to the webpage
    document.body.appendChild(nav);

    return nav;

}

// Creates the mobile navigation element
const mobileNav = createMobileNav();

// Finds the hamburger button used to open the mobile menu
const hamburgerBtn =
    document.getElementById("hamburgerBtn");

// Opens and closes the mobile navigation menu
if(hamburgerBtn){

    hamburgerBtn.addEventListener("click", () => {

        mobileNav.classList.toggle("open");

    });

}


/* ==========================================
   THEME
   Handles switching between light and dark mode
   and stores the user's selected preference.
========================================== */

const THEME_KEY = "mt-theme";

// Retrieves the saved theme or defaults to light mode
function getTheme(){

    return localStorage.getItem(THEME_KEY)
        || "light";

}

// Applies the selected theme to the webpage
function applyTheme(theme){

    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        THEME_KEY,
        theme
    );

    updateThemeIcon(theme);

}

// Loads the saved theme when the page opens
applyTheme(getTheme());

// Handles theme switching when the theme button is clicked
const themeBtn =
    document.getElementById("themeBtn");

if(themeBtn){

    themeBtn.addEventListener("click", () => {

        const nextTheme =
            getTheme() === "dark"
                ? "light"
                : "dark";

        applyTheme(nextTheme);

    });

}


function updateThemeIcon(theme){

    const themeBtn =
        document.getElementById("themeBtn");

    if(!themeBtn) return;

    themeBtn.innerHTML =
        theme === "dark"
            ? sunIcon()
            : moonIcon();

}


/* ==========================================
   ELEMENTS
   Stores references to HTML elements that are
   controlled or updated by JavaScript.
========================================== */

const reviewContainer =
    document.getElementById("reviewContainer");

const searchInput =
    document.getElementById("searchInput");

const departmentFilter =
    document.getElementById("departmentFilter");

const ratingFilter =
    document.getElementById("ratingFilter");

const totalReviews =
    document.getElementById("totalReviews");

const averageRating =
    document.getElementById("averageRating");

const topPerformers =
    document.getElementById("topPerformers");

const needsImprovement =
    document.getElementById("needsImprovement");

const reviewModal =
    document.getElementById("reviewModal");

const modalContent =
    document.getElementById("modalContent");

const closeModal =
    document.getElementById("closeModal");

const editModal =
    document.getElementById("editModal");

const closeEditModal =
    document.getElementById("closeEditModal");

const saveReviewBtn =
    document.getElementById("saveReviewBtn");

/* ==========================================
   DATA
   Stores all employee performance review
   information used throughout the page.
========================================== */

const reviews = [

{
id:1,
employee:"Sibongile Nkosi",
department:"Development",
rating:5,
reviewer:"HR Manager",
strengths:"Leadership, Coding Excellence",
improvements:"None",
goals:"Lead larger projects",
comments:"Outstanding performer",
status:"Top Performer"
},

{
id:2,
employee:"Lungile Moyo",
department:"HR",
rating:5,
reviewer:"Executive Board",
strengths:"Leadership, Communication",
improvements:"None",
goals:"Mentor junior managers",
comments:"Exceptional management skills",
status:"Top Performer"
},

{
id:3,
employee:"Thabo Molefe",
department:"QA",
rating:4,
reviewer:"QA Lead",
strengths:"Attention to Detail",
improvements:"Automation Testing",
goals:"Improve automation coverage",
comments:"Strong contributor",
status:"Outstanding"
},

{
id:4,
employee:"Keshav Naidoo",
department:"Sales",
rating:4,
reviewer:"Sales Director",
strengths:"Client Relations",
improvements:"Closing Efficiency",
goals:"Increase monthly targets",
comments:"Consistent sales results",
status:"Outstanding"
},

{
id:5,
employee:"Zanele Khumalo",
department:"Marketing",
rating:3,
reviewer:"Marketing Manager",
strengths:"Creativity",
improvements:"Campaign Reporting",
goals:"Improve analytics reporting",
comments:"Average performance",
status:"Needs Improvement"
},

{
id:6,
employee:"Sipho Zulu",
department:"Design",
rating:4,
reviewer:"Creative Director",
strengths:"UI Design",
improvements:"Time Management",
goals:"Reduce project delays",
comments:"Reliable designer",
status:"Outstanding"
},

{
id:7,
employee:"Naledi Moeketsi",
department:"IT",
rating:5,
reviewer:"IT Director",
strengths:"Infrastructure Management",
improvements:"Documentation",
goals:"Improve documentation process",
comments:"Excellent DevOps engineer",
status:"Top Performer"
},

{
id:8,
employee:"Farai Gumbo",
department:"Marketing",
rating:3,
reviewer:"Marketing Manager",
strengths:"Content Creation",
improvements:"SEO",
goals:"Improve SEO skills",
comments:"Needs development",
status:"Needs Improvement"
},

{
id:9,
employee:"Karabo Dlamini",
department:"Finance",
rating:4,
reviewer:"Finance Manager",
strengths:"Accuracy",
improvements:"Forecasting",
goals:"Improve forecasting skills",
comments:"Dependable employee",
status:"Outstanding"
},

{
id:10,
employee:"Fatima Patel",
department:"Support",
rating:3,
reviewer:"Support Manager",
strengths:"Customer Care",
improvements:"Leadership",
goals:"Develop leadership skills",
comments:"Average performance",
status:"Needs Improvement"
}

];

// Stores the ID of the review currently being edited
let currentReviewId = null;


/* ==========================================
   HELPERS
   Contains reusable utility functions used
   throughout the performance review system.
========================================== */

// Generates initials from an employee name for avatar display
function initials(name){

    return name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

}


/* ==========================================
   KPI
   Calculates and updates performance review
   summary statistics displayed on the page.
========================================== */

function updateStatistics(){

    // Displays the total number of reviews
    totalReviews.textContent =
        reviews.length;

    // Calculates the average employee rating
    const average =
        reviews.reduce(
            (sum,r) => sum + r.rating,
            0
        ) / reviews.length;

    // Displays the average rating rounded to one decimal place
    averageRating.textContent =
        average.toFixed(1);

    // Counts employees with a rating of 5
    topPerformers.textContent =
        reviews.filter(r =>
            r.rating === 5
        ).length;

    // Counts employees requiring improvement
    needsImprovement.textContent =
        reviews.filter(r =>
            r.rating <= 3
        ).length;

}


/* ==========================================
   DEPARTMENTS
   Creates department filter options from
   available review data.
========================================== */

function populateDepartments(){

    // Gets a list of unique departments
    const departments =
        [...new Set(
            reviews.map(r =>
                r.department
            )
        )];

    // Creates a dropdown option for each department
    departments.forEach(dep => {

        const option =
            document.createElement("option");

        option.value = dep;
        option.textContent = dep;

        departmentFilter.appendChild(option);

    });

}


/* ==========================================
   RENDER
   Dynamically displays performance review
   records inside the review table.
========================================== */

function renderReviews(data){

    // Clears existing review rows before displaying updated data
    reviewContainer.innerHTML = "";

    // Creates a table row for every performance review
    data.forEach(review => {

        reviewContainer.innerHTML += `

        <div class="trow emp-grid">

            <div class="who-cell">

                <div class="avatar">
                    ${initials(review.employee)}
                </div>

                <div>

                    <div class="nm">
                        ${review.employee}
                    </div>

                </div>

            </div>

            <div>${review.department}</div>

            <div>⭐ ${review.rating}</div>

            <div>${review.reviewer}</div>

            <div class="row-actions">

                <!-- Opens the selected review details modal -->
                <button
                    class="btn sm ghost"
                    onclick="viewReview(${review.id})">

                    View

                </button>

                <!-- Opens the selected review edit modal -->
                <button
                    class="btn sm"
                    onclick="editReview(${review.id})">

                    Edit

                </button>

            </div>

        </div>

        `;

    });

}

/* ==========================================
   VIEW
   Displays the full details of a selected
   performance review inside a modal window.
========================================== */

function viewReview(id){

    // Finds the review matching the selected ID
    const review =
        reviews.find(r => r.id === id);

    // Stops the function if no review is found
    if(!review) return;

    // Inserts review details into the modal content area
    modalContent.innerHTML = `

        <div class="line">
            <span>Employee</span>
            <strong>${review.employee}</strong>
        </div>

        <div class="line">
            <span>Department</span>
            <strong>${review.department}</strong>
        </div>

        <div class="line">
            <span>Rating</span>
            <strong>${review.rating}</strong>
        </div>

        <div class="line">
            <span>Strengths</span>
            <strong>${review.strengths}</strong>
        </div>

        <div class="line">
            <span>Improvements</span>
            <strong>${review.improvements}</strong>
        </div>

        <div class="line">
            <span>Goals</span>
            <strong>${review.goals}</strong>
        </div>

        <div class="line">
            <span>Comments</span>
            <strong>${review.comments}</strong>
        </div>

    `;

    // Displays the review details modal
    reviewModal.classList.add("show");

}

// Makes the viewReview function accessible from HTML buttons
window.viewReview = viewReview;


/* ==========================================
   EDIT
   Loads selected review information into the
   edit form for updating.
========================================== */

function editReview(id){

    // Finds the review matching the selected ID
    const review =
        reviews.find(r => r.id === id);

    // Stops the function if no review is found
    if(!review) return;

    // Stores the current review being edited
    currentReviewId = id;

    // Loads existing review values into the edit form fields
    editRating.value = review.rating;
    editStrengths.value = review.strengths;
    editImprovements.value = review.improvements;
    editGoals.value = review.goals;
    editComments.value = review.comments;

    // Opens the edit modal
    editModal.classList.add("show");

}

// Makes the editReview function accessible from HTML buttons
window.editReview = editReview;


/* ==========================================
   SAVE
   Saves updated review information and
   refreshes the displayed data.
========================================== */

saveReviewBtn.addEventListener("click", () => {

    // Finds the review currently being edited
    const review =
        reviews.find(r =>
            r.id === currentReviewId
        );

    // Stops execution if the review does not exist
    if(!review) return;

    // Updates review information with edited values
    review.rating =
        Number(editRating.value);

    review.strengths =
        editStrengths.value;

    review.improvements =
        editImprovements.value;

    review.goals =
        editGoals.value;

    review.comments =
        editComments.value;

    // Refreshes the review table and statistics
    renderReviews(reviews);

    updateStatistics();

    // Closes the edit modal after saving
    editModal.classList.remove("show");

});


/* ==========================================
   FILTERS
   Filters performance reviews based on search
   input, department, and rating selections.
========================================== */

function filterReviews(){

    // Gets the employee search value
    const search =
        searchInput.value.toLowerCase();

    // Gets the selected department value
    const department =
        departmentFilter.value;

    // Gets the selected rating value
    const rating =
        ratingFilter.value;

    // Filters reviews by employee name
    let filtered =
        reviews.filter(review =>

            review.employee
                .toLowerCase()
                .includes(search)

        );

    // Applies department filtering when a specific department is selected
    if(department !== "All"){

        filtered =
            filtered.filter(review =>
                review.department === department
            );

    }

    // Applies rating filtering when a specific rating is selected
    if(rating !== "All"){

        filtered =
            filtered.filter(review =>
                review.rating === Number(rating)
            );

    }

    // Displays the filtered review results
    renderReviews(filtered);

}

// Filters reviews when the search field changes
searchInput.addEventListener(
    "input",
    filterReviews
);

// Filters reviews when the department selection changes
departmentFilter.addEventListener(
    "change",
    filterReviews
);

// Filters reviews when the rating selection changes
ratingFilter.addEventListener(
    "change",
    filterReviews
);


/* ==========================================
   MODALS
   Handles opening and closing of modal windows.
========================================== */

// Closes the review details modal
closeModal.addEventListener("click", () => {

    reviewModal.classList.remove("show");

});

// Closes the edit review modal
closeEditModal.addEventListener("click", () => {

    editModal.classList.remove("show");

});


/* ==========================================
   STARTUP
   Initializes the performance review page by
   loading departments, statistics, and reviews.
========================================== */

// Creates department filter options
populateDepartments();

// Updates KPI summary values
updateStatistics();

// Displays all performance reviews
renderReviews(reviews);