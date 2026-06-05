const currentDate = document.getElementById("current-date");

const today = new Date();

const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
};

currentDate.textContent = today.toLocaleDateString("en-US", options);


// Modal controls
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const modal = document.getElementById("taskModal");

const form = document.querySelector(".add-task-form");
const tableBody = document.getElementById("taskTableBody");

const addTaskBtn = document.getElementById("AddTask");

// Modal title
const modalTitle = document.getElementById("modalTitle");

// DELETE CONFIRMATION MODAL
const confirmModal = document.getElementById("confirmModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

let rowToDelete = null;

// TRACK EDIT MODE
let editingRow = null;


// =====================================
// UPCOMING DEADLINES
// =====================================

function updateUpcomingDeadlines() {

    const deadlineContainer =
        document.getElementById("upcomingDeadlinesList");

    if (!deadlineContainer) return;

    deadlineContainer.innerHTML = "";

    const rows = tableBody.querySelectorAll("tr");

    const today = new Date();

    let upcomingFound = false;

    rows.forEach(row => {

        const taskName = row.cells[0].textContent;
        const eventArea = row.cells[1].textContent;
        const assignedTo = row.cells[2].textContent;

        const dueDateString = row.cells[3].textContent;
        const dueDate = new Date(dueDateString);

        const status = row.getAttribute("data-status");

        // Skip completed tasks
        if (status !== "In Progress") {
            return;
        }

        const daysRemaining =
            Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

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


// OPEN MODAL (ADD MODE)
openModal.addEventListener("click", () => {

    modal.classList.add("active");

    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML =
        'Add Task <i class="ri-add-large-line"></i>';

    modalTitle.textContent = "Add Task";
});


// CLOSE MODAL
closeModal.addEventListener("click", () => {

    modal.classList.remove("active");

    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML =
        'Add Task <i class="ri-add-large-line"></i>';

    modalTitle.textContent = "Add Task";
});


// SUBMIT FORM (ADD + EDIT)
form.addEventListener("submit", function (e) {

    e.preventDefault();

    const taskName =
        document.getElementById("task-name").value;

    const eventArea =
        document.getElementById("event-area").value;

    const assignedTo =
        document.getElementById("assigned-to").value;

    const dueDate =
        document.getElementById("due-date").value;

    const status =
        document.getElementById("status").value;

    // EDIT MODE
    if (editingRow) {

        editingRow.cells[0].textContent = taskName;
        editingRow.cells[1].textContent = eventArea;
        editingRow.cells[2].textContent = assignedTo;
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

        // ADD MODE
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
                <button class="edit-btn">
                    <i class="ri-edit-line"></i>
                </button>

                <button class="delete-btn">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    }

    // Reset UI
    form.reset();
    modal.classList.remove("active");

    addTaskBtn.innerHTML =
        'Add Task <i class="ri-add-large-line"></i>';

    modalTitle.textContent = "Add Task";

    // UPDATE UPCOMING DEADLINES
    updateUpcomingDeadlines();
});


// TABLE ACTIONS (EDIT + DELETE)
tableBody.addEventListener("click", function (e) {

    // DELETE
    if (e.target.closest(".delete-btn")) {

        rowToDelete = e.target.closest("tr");

        confirmModal.classList.add("active");
    }

    // EDIT
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

        addTaskBtn.innerHTML =
            'Save Changes <i class="ri-save-line"></i>';

        modalTitle.textContent = "Edit Task";
    }
});


// CANCEL DELETE
cancelDelete.addEventListener("click", () => {

    confirmModal.classList.remove("active");
    rowToDelete = null;
});


// CONFIRM DELETE
confirmDeleteBtn.addEventListener("click", () => {

    if (rowToDelete) {
        rowToDelete.remove();
    }

    updateUpcomingDeadlines();

    confirmModal.classList.remove("active");
    rowToDelete = null;
});


// INITIAL LOAD
updateUpcomingDeadlines();