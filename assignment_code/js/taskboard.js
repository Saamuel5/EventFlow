const currentDate = document.getElementById("current-date");

const today = new Date();

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

currentDate.textContent = today.toLocaleDateString("en-US", options);


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
// TASK OVERVIEW ELEMENTS
// ===============================
const completedCountEl = document.getElementById("completedCount");
const progressCountEl = document.getElementById("progressCount");
const overdueCountEl = document.getElementById("overdueCount");
const progressPercentEl = document.getElementById("progressPercent");
const progressCircle = document.getElementById("progressCircle");

const taskFilter = document.querySelector(".task-filter");

// ===============================
// SMOOTH PROGRESS ANIMATION
// ===============================
function animateProgressCircle(targetPercent) {

    let start = 0;
    const duration = 800; // animation speed (ms)
    const startTime = performance.now();

    function animate(now) {

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const currentPercent = Math.round(progress * targetPercent);

        // text update
        progressPercentEl.textContent = `${currentPercent}%`;

        // circle update
        progressCircle.style.background = `
            conic-gradient(
                var(--color-primary) 0% ${currentPercent}%,
                var(--color-info-light) ${currentPercent}% 100%
            )
        `;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
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
    void deadlineContainer.offsetHeight;

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

        const daysRemaining =
            Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        if (daysRemaining >= 0 && daysRemaining <= 7) {

            upcomingFound = true;

            const deadlineItem = document.createElement("div");
            deadlineItem.classList.add("deadline-item");

            deadlineItem.innerHTML = `
                <p><b>${taskName}</b></p>
                <small class="text-muted">${eventArea}</small><br>
                <small class="text-muted">
                    Assigned to ${assignedTo} • Due in ${daysRemaining}
                    day${daysRemaining !== 1 ? "s" : ""}
                </small>
            `;

            deadlineContainer.appendChild(deadlineItem);
        }
    });

    if (!upcomingFound) {
        deadlineContainer.innerHTML =
            `<p class="text-muted">No upcoming deadlines.</p>`;
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

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    completedCountEl.textContent = completed;
    progressCountEl.textContent = inProgress;
    overdueCountEl.textContent = overdue;

    // 🔥 smooth animation instead of instant change
    animateProgressCircle(percent);
}


// ===============================
// MODAL CONTROLS
// ===============================
openModal.addEventListener("click", () => {
    modal.classList.add("active");
    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';
    modalTitle.textContent = "Add Task";
});

closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';
    modalTitle.textContent = "Add Task";
});


function sortTasksByDate() {

    const rows = Array.from(tableBody.querySelectorAll("tr"));

    rows.sort((a, b) => {

        const dateA = new Date(a.cells[3].textContent);
        const dateB = new Date(b.cells[3].textContent);

        return dateA - dateB; // earliest date first
    });

    rows.forEach(row => tableBody.appendChild(row));
}

// ===============================
// SUBMIT FORM
// ===============================
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("task-name").value;
    const eventArea = document.getElementById("event-area").value;
    const assignedTo = document.getElementById("assigned-to").value;
    const dueDate = document.getElementById("due-date").value;
    const status = document.getElementById("status").value;

    if (editingRow) {

        editingRow.cells[0].textContent = taskName;
        editingRow.cells[1].textContent = eventArea;
        editingRow.cells[2].textContent = assignedTo;
        editingRow.cells[3].textContent = dueDate;

        // IMPORTANT: normalize status
        const cleanStatus = status.trim();

        editingRow.setAttribute("data-status", cleanStatus);

        // FORCE FULL REBUILD of status cell (fix visual bug)
        editingRow.cells[4].innerHTML = `
            <span class="status ${cleanStatus.toLowerCase().replace(/\s/g, '-')}">
                <i class="ri-circle-fill status-icon"></i>
                ${cleanStatus}
            </span>
        `;

        editingRow = null;

        // 🔥 FORCE UI REFRESH
        sortTasksByDate();
        updateUpcomingDeadlines();
        updateTaskOverview();
        filterTasks();

    } else {

        const row = document.createElement("tr");
        row.setAttribute("data-status", status);

        row.innerHTML = `
            <td>${taskName}</td>
            <td>${eventArea}</td>
            <td>${assignedTo}</td>
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
    modal.classList.remove("active");

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';
    modalTitle.textContent = "Add Task";

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

        document.getElementById("task-name").value =
            editingRow.cells[0].textContent;

        document.getElementById("event-area").value =
            editingRow.cells[1].textContent;

        document.getElementById("assigned-to").value =
            editingRow.cells[2].textContent;

        document.getElementById("due-date").value =
            editingRow.cells[3].textContent;

        document.getElementById("status").value =
            editingRow.getAttribute("data-status");

        modal.classList.add("active");

        addTaskBtn.innerHTML = 'Save Changes <i class="ri-save-line"></i>';
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

function filterTasks() {

    const selectedFilter = taskFilter.value;
    const rows = tableBody.querySelectorAll("tr");

    rows.forEach(row => {

        const status = row.getAttribute("data-status");

        if (
            selectedFilter === "All Tasks" ||
            status === selectedFilter
        ) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
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
// INITIAL LOAD
// ===============================
sortTasksByDate();
updateUpcomingDeadlines();
updateTaskOverview();
filterTasks();