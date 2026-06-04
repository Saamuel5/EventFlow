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

// ✅ NEW: modal title
const modalTitle = document.getElementById("modalTitle");


// DELETE CONFIRMATION MODAL
const confirmModal = document.getElementById("confirmModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDeleteBtn = document.getElementById("confirmDelete");

let rowToDelete = null;

// TRACK EDIT MODE
let editingRow = null;


// OPEN MODAL (ADD MODE)
openModal.addEventListener("click", () => {
    modal.classList.add("active");

    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';

    // ✅ NEW
    modalTitle.textContent = "Add Task";
});


// CLOSE MODAL
closeModal.addEventListener("click", () => {
    modal.classList.remove("active");

    editingRow = null;
    form.reset();

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';

    // ✅ NEW
    modalTitle.textContent = "Add Task";
});


// SUBMIT FORM (ADD + EDIT)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("task-name").value;
    const eventArea = document.getElementById("event-area").value;
    const assignedTo = document.getElementById("assigned-to").value;
    const dueDate = document.getElementById("due-date").value;
    const status = document.getElementById("status").value;

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

    addTaskBtn.innerHTML = 'Add Task <i class="ri-add-large-line"></i>';

    // ✅ NEW
    modalTitle.textContent = "Add Task";
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

        addTaskBtn.innerHTML = 'Save Changes <i class="ri-save-line"></i>';

        // ✅ NEW
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

    confirmModal.classList.remove("active");
    rowToDelete = null;
});