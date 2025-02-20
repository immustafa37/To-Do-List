// Get elements
const addButton = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskDeadline = document.getElementById('taskDeadline');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// Switch between Light and Dark Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Function to add a task
function addTask(taskContent, priority, deadline, completed = false) {
    if (!taskContent) return; // Prevent empty tasks

    // Create task element
    const task = document.createElement('li');
    task.classList.add('task');
    task.setAttribute('data-priority', priority);
    task.draggable = true;
    
    // Task HTML structure
    task.innerHTML = `
        <span class="task-content">${taskContent}</span>
        <span class="priority">${priority}</span>
        <span class="deadline">${deadline}</span>
        <button class="deleteBtn">Delete</button>
    `;

    // Mark task as completed if it was stored as completed
    if (completed) {
        task.classList.add('completed');
    }

    // Event to mark task as complete
    task.addEventListener('click', function() {
        task.classList.toggle('completed');
        saveTasksToLocalStorage();
    });

    // Event to delete task
    task.querySelector('.deleteBtn').addEventListener('click', function(e) {
        e.stopPropagation();
        task.remove();
        saveTasksToLocalStorage();
    });

    // Drag and drop functionality
    task.addEventListener('dragstart', () => task.classList.add('dragging'));
    task.addEventListener('dragend', () => task.classList.remove('dragging'));

    taskList.appendChild(task);
    saveTasksToLocalStorage();
}

// Get the element closest to the pointer for drag-and-drop
function getDragAfterElement(taskList, y) {
    const draggableElements = [...taskList.querySelectorAll('.task:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task');

    taskItems.forEach(task => {
        tasks.push({
            content: task.querySelector('.task-content').textContent,
            completed: task.classList.contains('completed'),
            priority: task.getAttribute('data-priority'),
            deadline: task.querySelector('.deadline').textContent
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTask(task.content, task.priority, task.deadline, task.completed);
    });
}

// Event listener to add task
addButton.addEventListener('click', function() {
    const taskContent = taskInput.value.trim();
    const priority = taskPriority.value;
    const deadline = taskDeadline.value;

    if (!taskContent) {
        alert("Please enter a task!");
        return;
    }

    addTask(taskContent, priority, deadline);
    taskInput.value = ''; // Clear the input
    taskDeadline.value = ''; // Clear the deadline
});

// Drag and drop event for sorting tasks
taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingTask = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggingTask);
    } else {
        taskList.insertBefore(draggingTask, afterElement);
    }
    saveTasksToLocalStorage(); // Save new order
});

// Load tasks when the page loads
loadTasksFromLocalStorage();
