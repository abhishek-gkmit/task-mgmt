var tasks = [];


document.addEventListener('DOMContentLoaded', function setup() {
  addEventListeners();
});

function addEventListeners() {
  console.log('adding event listeners');
  var addBtn = document.querySelector('#add-btn');
  addBtn.addEventListener('click', addTaskHandler);
}

function addTaskHandler(event){
  var modal = document.querySelector('#add-task-modal');
  modal.classList.toggle('hide-modal');
  modal.classList.toggle('show-modal');

  var taskInput = document.querySelector('.task-input');
  taskInput.focus();

  var taskSubmitBtn = document.querySelector('.task-submit-btn');
  taskSubmitBtn.addEventListener('click', addTaskWrapper);

  function addTaskWrapper(event) {
    var name = taskInput.value;
    addTask(Date.now(), name);
  }
}

// API functions

function displayTasks() {
  var ul = document.querySelector('#tasks-list');

  ul.innerHTML = tasks.map(function taskToElement(task) {
    return `<li data-id="${task.id}" data-completed="${task.completed}>
              <p class="task-name">${task.name}</p>
            </li>`;
  }).join('\n');
}

function addTask(id, name, completed=false){
  tasks.push({
    id,
    name,
    completed
  });

  // re-rendering the tasks on the webpage
  displayTasks();
}

/* Complete the task using the id*/
function completeTask(id) {
  // needs improvement 'cause map will run the function on the whole array
  // even if the target task is found
  tasks = tasks.map(function complete(task) {
    if(task.id === id){
      return {...task, completed: true};
    }

    return task;
  })
}

/* Update the task in the task array*/
function updateTask(id, name, completed) {
  if(!id || !name || !completed) return;

  tasks = tasks.map(function update(task) {
    if(task.id === id){
      return {
        id,
        name,
        completed
      };
    }

    return task;
  })

}

function deleteTask(id) {
  tasks = tasks.filter(function del(task) {
    if(task.id === id){
      return false;
    }

    return true;
  });
}

/* Filter the tasks according to the completed state
 * @param {boolean} completed: the filter
 * @returns {Array} Returns the new filtered array*/
function filterTasks(completed=true) {
  return tasks.filter(function filter(task) {
    return task.completed === completed;
  })
}

/*
  - Simulate a 2-second delay using `setTimeout`.
  - Display tasks after they're "loaded."
  */
function loadTasks() {

}

async function loadTasksAsync() {

}
