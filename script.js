// Get elements
const addButton = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

// Function to add a task
function addTask(taskContent) {
    // Create task element
    const task = document.createElement('li');
    task.classList.add('task');
    task.innerHTML = `
        <span>${taskContent}</span>
        <button class="deleteBtn">Delete</button>
    `;
    
    // Event to mark task as complete
    task.addEventListener('click', function() {
        task.classList.toggle('completed');
        saveTasksToLocalStorage();
    });

    // Event to delete task
    const deleteButton = task.querySelector('.deleteBtn');
    deleteButton.addEventListener('click', function(e) {
        e.stopPropagation();
        task.remove();
        saveTasksToLocalStorage();
    });

    taskList.appendChild(task);
    saveTasksToLocalStorage();
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.task');
    
    taskItems.forEach(task => {
        tasks.push({
            content: task.querySelector('span').textContent,
            completed: task.classList.contains('completed')
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach(task => {
        addTask(task.content);
        if (task.completed) {
            const lastTask = taskList.lastElementChild;
            lastTask.classList.add('completed');
        }
    });
}

// Event listener to add task
addButton.addEventListener('click', function() {
    const taskContent = taskInput.value.trim();
    if (taskContent) {
        addTask(taskContent);
        taskInput.value = ''; // Clear the input
    }
});

// Load tasks when the page loads
loadTasksFromLocalStorage();