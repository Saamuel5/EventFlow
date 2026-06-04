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


// OPEN MODAL
openModal.addEventListener("click", () => {
    modal.classList.add("active");
    form.reset();
});


// CLOSE MODAL
closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
    form.reset();
});


// ADD TASK
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskName = document.getElementById("task-name").value;
    const eventArea = document.getElementById("event-area").value;
    const assignedTo = document.getElementById("assigned-to").value;
    const dueDate = document.getElementById("due-date").value;
    const status = document.getElementById("status").value;

    const row = document.createElement("tr");

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

    form.reset();
    modal.classList.remove("active");
});
