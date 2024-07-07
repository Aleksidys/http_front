document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('taskModal');
    const btn = document.querySelector('.addTaskBtn');
    const span = document.querySelectorAll('.close');
    const form = document.getElementById('taskForm');
    const taskContainer = document.querySelector('.taskContainer');

    btn.onclick = function () {
        modal.style.display = 'block';
    };

    span.forEach(function(element) {
        element.onclick = function () {
            modal.style.display = 'none';
        };
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    form.onsubmit = async function (event) {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;

        const newTask = {
            name: taskName,
            description: taskDescription
        };

        const response = await fetch('http://localhost:7070/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            const task = await response.json();
            addTaskToDOM(task);
            modal.style.display = 'none';
        }
    };

    async function loadTasks() {
        const response = await fetch('http://localhost:7070/tasks');
        const tasks = await response.json();
        tasks.forEach(task => {
            addTaskToDOM(task);
        });
    }

    function addTaskToDOM(task) {
        const taskElement = document.createElement('div');
        const createdDate = new Date(task.created).toLocaleString();
        taskElement.innerHTML = `
            <h3>${task.name}</h3>
            <p class="taskDescription" style="display:none;"></p>
            <p class="taskCreated">Создано: ${createdDate}</p>
            <input type="checkbox" ${task.status ? 'checked' : ''} data-id="${task.id}" class="taskComplete">
            <button data-id="${task.id}" class="editTaskBtn">Изменить</button>
            <button data-id="${task.id}" class="deleteTaskBtn">Удалить</button>
            <button data-id="${task.id}" class="detailsTaskBtn">Подробнее</button>
        `;
        taskContainer.appendChild(taskElement);

        taskElement.querySelector('.taskComplete').addEventListener('change', toggleTaskComplete);
        taskElement.querySelector('.editTaskBtn').addEventListener('click', editTask);
        taskElement.querySelector('.deleteTaskBtn').addEventListener('click', deleteTask);
        taskElement.querySelector('.detailsTaskBtn').addEventListener('click', showTaskDetails);
    }

    async function toggleTaskComplete(event) {
        const id = event.target.dataset.id;
        const status = event.target.checked;

        const response = await fetch(`http://localhost:7070/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            event.target.checked = !status;
        }
    }

    async function deleteTask(event) {
        const id = event.target.dataset.id;

        const response = await fetch(`http://localhost:7070/tasks/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            event.target.closest('div').remove();
        }
    }

    async function editTask(event) {
        const id = event.target.dataset.id;
        const taskName = prompt('Введите новое название задачи:');
        const taskDescription = prompt('Введите новое описание задачи:');

        if (taskName && taskDescription) {
            const response = await fetch(`http://localhost:7070/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: taskName, description: taskDescription })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                const taskElement = event.target.closest('div');
                taskElement.querySelector('h3').textContent = updatedTask.name;
                taskElement.querySelector('.taskDescription').textContent = updatedTask.description;
            }
        }
    }

    async function showTaskDetails(event) {
        const id = event.target.dataset.id;
        const taskElement = event.target.closest('div');
        const taskDescription = taskElement.querySelector('.taskDescription');

        if (taskDescription.style.display === 'none') {
            const response = await fetch(`http://localhost:7070/tasks/${id}`);
            if (response.ok) {
                const task = await response.json();
                taskDescription.textContent = task.description;
                taskDescription.style.display = 'block';
                event.target.textContent = 'Скрыть';
            }
        } else {
            taskDescription.style.display = 'none';
            event.target.textContent = 'Подробнее';
        }
    }

    loadTasks();
});
