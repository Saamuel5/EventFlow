const currentDate = document.getElementById("current-date");

const today = new Date();

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

currentDate.textContent = today.toLocaleDateString("en-US", options);

// CLOSE BTN
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");

//DARK THEME
const themeToggler = document.querySelector(".theme-toggler");

// SHOW SIDEBAR
menuBtn.addEventListener('click', () =>{
    sideMenu.style.display = 'block';
})

// CLOSE SIDEBAR
closeBtn.addEventListener('click', () => {
    sideMenu.style.display = 'none';
})

//CHANGE TO DARK THEME
themeToggler.addEventListener('click', () =>{
    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('i:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('i:nth-child(2)').classList.toggle('active');
})

// ===============================
// DOM ELEMENTS
// ===============================
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("taskModal");

const form = document.querySelector(".add-task-form");
const tableBody = document.getElementById("taskTableBody");

const addTaskBtn = document.getElementById("AddTask");
const modalTitle = document.getElementById("modalTitle");

// Delete modal
const confirmModal = document.getElementById("confirmModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

let rowToDelete = null;
let editingRow = null;


// ===============================
// MULTI USER SYSTEM
// ===============================
let assignedUsers = [];

const assignedSelect = document.getElementById("assigned-to");

const selectedUsersContainer = document.getElementById("selected-users");
selectedUsersContainer.style.display = "flex";
selectedUsersContainer.style.flexWrap = "wrap";
selectedUsersContainer.style.gap = "6px";
selectedUsersContainer.style.marginBottom = "8px";

function renderAssignedUsers() {
    selectedUsersContainer.innerHTML = "";

    assignedUsers.forEach((user, index) => {
        const tag = document.createElement("span");
        tag.textContent = user;

        tag.style.padding = "4px 10px";
        tag.style.borderRadius = "20px";
        tag.style.background = "#991bdd";
        tag.style.color = "white";
        tag.style.fontSize = "12px";
        tag.style.cursor = "pointer";

        tag.onclick = () => {
            assignedUsers.splice(index, 1);
            renderAssignedUsers();
        };

        selectedUsersContainer.appendChild(tag);
    });
}

assignedSelect.addEventListener("change", () => {
    const value = assignedSelect.value;

    if (value && !assignedUsers.includes(value)) {
        assignedUsers.push(value);
        renderAssignedUsers();
    }

    assignedSelect.value = "";
});


// ===============================
// TASK OVERVIEW ELEMENTS
// ===============================
const completedCountEl = document.getElementById("completedCount");
const progressCountEl = document.getElementById("progressCount");
const overdueCountEl = document.getElementById("overdueCount");
const progressPercentEl = document.getElementById("progressPercent");
const progressCircle = document.getElementById("progressCircle");

const taskFilter = document.querySelector(".task-filter");


// ===============================
// OPEN / CLOSE MODAL (FIXED)
// ===============================
openModal.addEventListener("click", () => {
    modal.classList.add("active");
    editingRow = null;
    form.reset();
    assignedUsers = [];
    renderAssignedUsers();

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';
    modalTitle.textContent = "Add Task";
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    editingRow = null;
    form.reset();
    assignedUsers = [];
    renderAssignedUsers();
});


// ===============================
// PROGRESS ANIMATION
// ===============================
function animateProgressCircle(targetPercent) {

    const startTime = performance.now();
    const duration = 800;

    function animate(now) {

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercent = Math.round(progress * targetPercent);

        progressPercentEl.textContent = `${currentPercent}%`;

        progressCircle.style.background = `
            conic-gradient(
                var(--color-primary) 0% ${currentPercent}%,
                var(--color-info-light) ${currentPercent}% 100%
            )
        `;

        if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}


// ===============================
// UPCOMING DEADLINES
// ===============================
function updateUpcomingDeadlines() {

    const deadlineContainer = document.getElementById("upcomingDeadlinesList");
    if (!deadlineContainer) return;

    deadlineContainer.innerHTML = "";

    const rows = tableBody.querySelectorAll("tr");
    const now = new Date();
    let upcomingFound = false;

    rows.forEach(row => {

        const status = row.getAttribute("data-status");
        if (status?.toLowerCase() !== "in progress") return;

        const taskName = row.cells[0].textContent;
        const eventArea = row.cells[1].textContent;
        const assignedTo = row.cells[2].textContent;
        const dueDate = new Date(row.cells[3].textContent);

        const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        if (daysRemaining >= 0 && daysRemaining <= 7) {

            upcomingFound = true;

            const item = document.createElement("div");
            item.classList.add("deadline-item");

            item.innerHTML = `
                <p><b>${taskName}</b></p>
                <small>${eventArea}</small><br>
                <small>Assigned to ${assignedTo} • Due in ${daysRemaining} day(s)</small>
            `;

            deadlineContainer.appendChild(item);
        }
    });

    if (!upcomingFound) {
        deadlineContainer.innerHTML = `<p class="text-muted">No upcoming deadlines.</p>`;
    }
}


// ===============================
// TASK OVERVIEW
// ===============================
function updateTaskOverview() {

    const rows = tableBody.querySelectorAll("tr");

    let completed = 0;
    let inProgress = 0;
    let overdue = 0;

    rows.forEach(row => {

        const status = row.getAttribute("data-status");

        if (status === "Completed") completed++;
        else if (status === "In Progress") inProgress++;
        else if (status === "Overdue") overdue++;
    });

    const total = completed + inProgress + overdue;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    completedCountEl.textContent = completed;
    progressCountEl.textContent = inProgress;
    overdueCountEl.textContent = overdue;

    animateProgressCircle(percent);
}


// ===============================
// SORT
// ===============================
function sortTasksByDate() {

    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((a, b) =>
        new Date(a.cells[3].textContent) - new Date(b.cells[3].textContent)
    );

    rows.forEach(row => tableBody.appendChild(row));
}


// ===============================
// SUBMIT FORM
// ===============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("task-name").value;
    const eventArea = document.getElementById("event-area").value;
    const dueDate = document.getElementById("due-date").value;
    const status = document.getElementById("status").value;

    const assignedText = assignedUsers.join(", ");

    if (editingRow) {

        editingRow.cells[0].textContent = taskName;
        editingRow.cells[1].textContent = eventArea;
        editingRow.cells[2].textContent = assignedText;
        editingRow.cells[3].textContent = dueDate;

        editingRow.setAttribute("data-status", status);

        editingRow.cells[4].innerHTML = `
            <span class="status ${status.toLowerCase().replace(/\s/g, '-')}">
                <i class="ri-circle-fill status-icon"></i>
                ${status}
            </span>
        `;

        editingRow = null;

    } else {

        const row = document.createElement("tr");
        row.setAttribute("data-status", status);

        row.innerHTML = `
            <td>${taskName}</td>
            <td>${eventArea}</td>
            <td>${assignedText}</td>
            <td>${dueDate}</td>
            <td>
                <span class="status ${status.toLowerCase().replace(/\s/g, '-')}">
                    <i class="ri-circle-fill status-icon"></i>
                    ${status}
                </span>
            </td>
            <td class="action-buttons">
                <button class="edit-btn"><i class="ri-edit-line"></i></button>
                <button class="delete-btn"><i class="ri-delete-bin-line"></i></button>
            </td>
        `;

        tableBody.appendChild(row);
    }

    form.reset();
    assignedUsers = [];
    renderAssignedUsers();

    modal.classList.remove("active");

    sortTasksByDate();
    updateUpcomingDeadlines();
    updateTaskOverview();
    filterTasks();
});


// ===============================
// TABLE ACTIONS
// ===============================
tableBody.addEventListener("click", function (e) {

    if (e.target.closest(".delete-btn")) {
        rowToDelete = e.target.closest("tr");
        confirmModal.classList.add("active");
    }

    if (e.target.closest(".edit-btn")) {

        editingRow = e.target.closest("tr");

        document.getElementById("task-name").value = editingRow.cells[0].textContent;
        document.getElementById("event-area").value = editingRow.cells[1].textContent;

        assignedUsers = editingRow.cells[2].textContent.split(", ").filter(Boolean);
        renderAssignedUsers();

        document.getElementById("due-date").value = editingRow.cells[3].textContent;
        document.getElementById("status").value = editingRow.getAttribute("data-status");

        modal.classList.add("active");
        addTaskBtn.innerHTML = "Save Changes";

        modalTitle.textContent = "Edit Task";
    }
});


// ===============================
// DELETE
// ===============================
cancelDelete.addEventListener("click", () => {
    confirmModal.classList.remove("active");
    rowToDelete = null;
});

confirmDeleteBtn.addEventListener("click", () => {

    if (rowToDelete) rowToDelete.remove();

    sortTasksByDate();
    updateUpcomingDeadlines();
    updateTaskOverview();
    filterTasks();

    confirmModal.classList.remove("active");
    rowToDelete = null;
});


// ===============================
// FILTER
// ===============================
function filterTasks() {

    const selectedFilter = taskFilter.value;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {

        const status = row.getAttribute("data-status");

        row.style.display =
            selectedFilter === "All Tasks" || status === selectedFilter
                ? ""
                : "none";
    });
}

taskFilter.addEventListener("change", filterTasks);

// ===============================
// LOGOUT MODAL
// ===============================

const logoutBtn = document.getElementById("logoutBtn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");

logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    logoutModal.classList.add("active");
});

cancelLogout.addEventListener("click", () => {
    logoutModal.classList.remove("active");
});

confirmLogout.addEventListener("click", () => {
    window.location.href = "index.html"; // or login page
});

// ===============================
// INIT
// ===============================
sortTasksByDate();
updateUpcomingDeadlines();
updateTaskOverview();
filterTasks();