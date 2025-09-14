document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const emptyState = document.getElementById('empty-state');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = today.toLocaleDateString('en-US', options);
    };

    const checkEmptyState = () => {
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
        });

        if (filteredTasks.length === 0) {
            emptyState.classList.add('visible');
        } else {
            emptyState.classList.remove('visible');
        }
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'all') return true;
            if (currentFilter === 'pending') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
        }).sort((a, b) => a.id - b.id);

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;

            taskItem.innerHTML = `
                <div class="checkbox" role="button" tabindex="0" aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <button class="delete-btn" aria-label="Delete task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
        checkEmptyState();
    };

    const addTask = (text) => {
        if (text.trim() === '') return;

        const newTask = {
            id: Date.now(),
            text: text.trim(),
            completed: false,
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
    };

    const toggleTask = (id) => {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskList.addEventListener('click', (e) => {
        const target = e.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = Number(taskItem.dataset.id);

        if (target.closest('.checkbox')) {
            toggleTask(taskId);
        }

        if (target.closest('.delete-btn')) {
            deleteTask(taskId);
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Initial render
    renderDate();
    renderTasks();
});
