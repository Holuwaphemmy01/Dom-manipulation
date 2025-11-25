
// ============================================
// DOM MANIPULATION - TASK MANAGER PROJECT
// ============================================

let taskCounter = 0;

// ========================================
// SELECTING ELEMENTS
// ========================================

// 1. getElementById() - Selects ONE element by its ID
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// 2. getElementsByClassName() - Selects ALL elements with a class (returns HTMLCollection)
const filterButtons = document.getElementsByClassName('filter-btn');

// 3. getElementsByTagName() - Selects ALL elements by tag name (returns HTMLCollection)
const allButtons = document.getElementsByTagName('button');

// 4. querySelector() - Selects the FIRST element that matches (modern way)
const container = document.querySelector('.container');

// 5. querySelectorAll() - Selects ALL elements that match (returns NodeList)
const allFilterBtns = document.querySelectorAll('.filter-btn');


// ========================================
// ADD TASK FUNCTION
// ========================================
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validation
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    taskCounter++;

    // Remove empty message if exists
    const emptyState = taskList.querySelector('.empty-state');
    if (emptyState) {
        emptyState.remove();
    }

    // Create new task item
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-category', categorySelect.value);
    
    li.innerHTML = `
        <div class="task-info">
            <div class="task-title">${taskText}</div>
            <span class="task-category category-${categorySelect.value}">${categorySelect.value.toUpperCase()}</span>
        </div>
        <div class="task-actions">
            <button class="btn-complete" onclick="toggleComplete(this)">Complete</button>
            <button class="btn-delete" onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    // Add to list
    taskList.appendChild(li);
    
    // Clear input
    taskInput.value = '';
    
    // Update statistics
    updateStats();
}


// ========================================
// TOGGLE COMPLETE FUNCTION
// Uses PARENT traversal
// ========================================
function toggleComplete(button) {
    // TRAVERSING: Get the parent task item
    // closest() finds the nearest parent with class 'task-item'
    const taskItem = button.closest('.task-item');
    
    // Toggle completed class
    taskItem.classList.toggle('completed');
    
    // Update statistics
    updateStats();
}


// ========================================
// DELETE TASK FUNCTION
// Uses PARENT traversal
// ========================================
function deleteTask(button) {
    // TRAVERSING:  Get the parent task item
    const taskItem = button.closest('.task-item');
    
    // Remove from DOM
    taskItem.remove();
    
    // Check if list is empty
    const remainingTasks = document.getElementsByClassName('task-item');
    if (remainingTasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one to get started!</div>';
    }
    
    // Update statistics
    updateStats();
}


// ========================================
// FILTER TASKS FUNCTION
// Uses querySelectorAll() to get all tasks
// ========================================
function filterTasks(category) {
    // Get all task items
    const allTasks = document.querySelectorAll('.task-item');
    
    // Loop through each task
    allTasks.forEach(task => {
        if (category === 'all') {
            // Show all tasks
            task.style.display = 'flex';
        } else if (category === 'completed') {
            // Show only completed tasks
            if (task.classList.contains('completed')) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        } else {
            // Show tasks by category
            const taskCategory = task.getAttribute('data-category');
            if (taskCategory === category) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        }
    });
}


// ========================================
// UPDATE STATISTICS FUNCTION
// Uses getElementById() and getElementsByClassName()
// ========================================
function updateStats() {
    // Get all tasks using getElementsByClassName
    const allTasks = document.getElementsByClassName('task-item');
    
    // Get completed tasks using querySelectorAll
    const completedTasks = document.querySelectorAll('.task-item.completed');
    
    // Update the numbers using getElementById
    document.getElementById('totalTasks').textContent = allTasks.length;
    document.getElementById('completedTasks').textContent = completedTasks.length;
    document.getElementById('pendingTasks').textContent = allTasks.length - completedTasks.length;
}


// ========================================
// EVENT LISTENERS
// ======================================== 

// When "Add Task" button is clicked
addTaskBtn.addEventListener('click', addTask);

// When Enter key is pressed in input
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Filter buttons - loop through all filter buttons
allFilterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        
        // Remove 'active' class from all buttons
        for (let i = 0; i < filterButtons.length; i++) {
            filterButtons[i].classList.remove('active');
        }
        
        // Add 'active' class to clicked button
        this.classList.add('active');
        
        // Get filter type and filter tasks
        const filterType = this.getAttribute('data-filter');
        filterTasks(filterType);
    });
});