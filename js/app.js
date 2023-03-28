const form = document.querySelector('.form-new-task');
const formInput = document.querySelector('.form-new-task__input');
const formButton = document.querySelector('#add-task');
const deleteButton = document.querySelector('#delete-complited');
const tasksList = document.querySelector('.tasks__list');
const emptyList = document.querySelector('#emply-list-item');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function(task) {
    renderTask(task);
  });
};


checkEmptyList()

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(e) {
  e.preventDefault();

  const inputText = formInput.value;

  const newTask = {
    id: Date.now(),
    text: inputText,
    done: false,
    doneTask: false,
    btn: true,
  };

  tasks.push(newTask);

  renderTask(newTask);

  formInput.value = '';
  formInput.focus();

  checkEmptyList();
  saveToLocalStorage();
}

function deleteTask(e) {
  if (e.target.dataset.action !== 'delete') {
    return;
  };

  const parentNode = e.target.closest('.tasks__item');
  const id = parentNode.id;

  const index = tasks.findIndex(function(item) {
    if (item.id == id) {
      return true;
    }
  });

  tasks.splice(index, 1);

  parentNode.remove();

  checkEmptyList();
  saveToLocalStorage();
}

function doneTask(e) {
  if (e.target.dataset.action !== 'done') {
    return;
  }

  const parentNode = e.target.closest('.tasks__item');
  const id = parentNode.id;

  const task = tasks.find(function(item) {
    if (item.id == id) {
      return true;
    }
  })

  task.done = !task.done;
  task.btn = !task.btn;
  task.doneTask = !task.doneTask;
  
  const taskTitle = parentNode.querySelector('.tasks__text');
  parentNode.classList.toggle('_done');
  taskTitle.classList.toggle('_cross');

  if (e.target.innerText == 'Done') {
    e.target.innerText = 'Undone';
  } else if (e.target.innerText == 'Undone')  {
    e.target.innerText = 'Done';
  }

  saveToLocalStorage();
}

function checkEmptyList() {
  if (tasks.length == 0) {
    const emptyListHTML = `<li id="emply-list-item" class="tasks__item">Task list is empty</li>`;

    tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emply-list-item');

    emptyListEl ? emptyListEl.remove() : null;
  };
};

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

function renderTask(task) {
  const cssClass = task.done ? "tasks__text _cross" : "tasks__text";
  const btnDoneUndone = task.btn ? "Done" : "Undone";
  const doneTask = task.doneTask ? "_done" : "";

  const taskHTML = `<li id="${task.id}" class="tasks__item ${doneTask}">
                      <div class="${cssClass}">${task.text}</div>
                      <div class="tasks__actions">
                        <button data-action="done" type="button" class="tasks__button button button_green">${btnDoneUndone}</button>
                        <button data-action="delete" type="button" class="tasks__button button button_red">Delete</button>
                      </div>
                    </li>`;

  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

