
const taskInput = document.getElementById("task-input");
const taskTime = document.getElementById("task-time");
const taskDate = document.getElementById("task-date");

const addButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const searchInput = document.getElementById("search-input");

const closeError = document.getElementById("close-error");
const errorMessage = document.getElementById("error-message");



let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingId = null;


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showError() {
    errorMessage.hidden = false;
}


closeError.addEventListener("click", () => {
    errorMessage.hidden = true;
});

addButton.addEventListener("click", () => {
    const description = taskInput.value.trim();
    const date = taskDate.value;
    const time = taskTime.value;

    if (!description || !date || !time) {
        showError();
        return;
    }

    if (editingId !== null) {
        const task = tasks.find(task => task.id === editingId);

        if (task) {
            task.description = description;
            task.date = date;
            task.time = time;
        }

        editingId = null;
        addButton.textContent = "Add Task";
    } else {
        tasks.push({
            id: Date.now(),
            description: description,
            date: date,
            time: time
        });
    }

 tasks.sort((a, b) =>
    new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
);

    saveTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    errorMessage.hidden = true;

    displayTasks();
});

searchInput.addEventListener("input", displayTasks);

function formatDate(date) {
    const selected = new Date(date + "T00:00:00");
    const today = new Date();

    if (selected.toDateString() === today.toDateString()) {
        return "Today";
    }

    return selected.toDateString();
}

function formatTime(time) {
    const [hours, minutes] = time.split(":");
    const hour = Number(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${period}`;
}

function displayTasks() {
    taskList.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(searchText)
    );

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent = searchText
            ? "No matching tasks found."
            : "No tasks added yet.";

        taskList.appendChild(emptyMessage);
        return;
    }

    const groupedTasks = {};

    filteredTasks.forEach(task => {
        if (!groupedTasks[task.date]) {
            groupedTasks[task.date] = [];
        }

        groupedTasks[task.date].push(task);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Object.keys(groupedTasks).sort().forEach(date => {
        const daySection = document.createElement("section");
        daySection.className = "task-day";

        const heading = document.createElement("h2");
        heading.textContent = formatDate(date);
        daySection.appendChild(heading);

      const selectedDate = new Date(date);

        const dueHeading = document.createElement("h3");
        dueHeading.className = "task-section";
        dueHeading.textContent =
            selectedDate <= today ? "Due Tasks" : "Upcoming Tasks";

        daySection.appendChild(dueHeading);

        groupedTasks[date].forEach(task => {

            
            const item = document.createElement("div");
            item.className = "task-item";

            const details = document.createElement("div");
            details.className = "task-details";

            const description = document.createElement("span");
            description.textContent = task.description;

            const time = document.createElement("span");
            time.className = "task-time";
            time.textContent = formatTime(task.time);

            details.append(description, time);

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "edit-button";

            editButton.addEventListener("click", () => {
                taskInput.value = task.description;
                taskDate.value = task.date;
                taskTime.value = task.time;

                editingId = task.id;
                addButton.textContent = "Update Task";
                taskInput.focus();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete-button";

            deleteButton.addEventListener("click", () => {
                tasks = tasks.filter(item => item.id !== task.id);

                if (editingId === task.id) {
                    editingId = null;
                    addButton.textContent = "Add Task";
                    taskInput.value = "";
                    taskDate.value = "";
                    taskTime.value = "";
                }

                saveTasks();
                displayTasks();
            });

            actions.append(editButton, deleteButton);
            item.append(details, actions);
            daySection.appendChild(item);
        });

        taskList.appendChild(daySection);
    });
}

displayTasks();
