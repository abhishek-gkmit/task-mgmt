var tasks = [];


document.addEventListener('DOMContentLoaded', function setup() {
  addEventListeners();
});

function addEventListeners() {
  console.log('adding event listeners');

  var addBtn = document.querySelector('.task-add-btn');
  addBtn.addEventListener('click', addTaskHandler);

  var taskInput = document.querySelector('.task-input');
  taskInput.focus();

  taskInput.addEventListener('keyup', function handleEnterKey(event) {
    if(event.key === 'Enter'){
      addTaskHandler(event);
    }
  });

  var filters = document.querySelector('.filters');
  filters.addEventListener('change', (event) => displayTasks());
}

function addTaskHandler(event){
  var taskInput = document.querySelector('.task-input');
  var name = taskInput.value;

  if(!name){
    return;
  }

  // calling the API function and saving the task
  addTask(Date.now(), name);

  // clearing task after adding
  taskInput.value = '';
}

// API functions

function displayTasks() {
  var ul = document.querySelector('#tasks-list');
  ul.replaceChildren();

  var filteredTasks = tasks;

  var filter = document.querySelector('.filters').value;
  if(filter === 'completed'){
    filteredTasks = filterTasks();
  } else if(filter === 'pending') {
    filteredTasks = filterTasks(false);
  }

  filteredTasks.forEach(function taskToElement(task) {
    var li = document.createElement('li');
    li.classList.add('task-container');
    li.setAttribute('data-id', task.id);
    li.setAttribute('data-completed', task.completed);

    var p = document.createElement('p');
    p.classList.add('task-name');
    p.innerText = task.name;
    if(task.completed){
      p.classList.add('completed-task');
    }


    // TODO: add deletBtn, completeBtn, updateBtn
    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', (event) => deleteTask(task.id));

    var completeBtn = document.createElement('button');
    completeBtn.classList.add('complete-btn');
    completeBtn.innerText = 'Mark Complete';
    completeBtn.addEventListener('click', (event) => completeTask(task.id));

    var updateBtn = document.createElement('button');
    updateBtn.classList.add('update-btn');
    updateBtn.innerText = 'Edit';
    // updateBtn.addEventListener('click', )


    li.appendChild(p);
    li.appendChild(deleteBtn);
    li.appendChild(completeBtn);
    li.appendChild(updateBtn);

    ul.appendChild(li);
  });

  // set the focus to task-input
  document.querySelector('.task-input').focus();
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
  });

  displayTasks();
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

  displayTasks();
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
