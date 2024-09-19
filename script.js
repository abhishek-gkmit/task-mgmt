var tasks = loadTasks();

// document.querySelector shortcut
var $ = function (selector) {
  return document.querySelector(selector);
}


document.addEventListener('DOMContentLoaded', function setup() {
  addEventListeners();
});


function addEventListeners() {
  console.log('adding event listeners');

  var addBtn = document.querySelector('.task-add-btn');
  addBtn.addEventListener('click', addTaskHandler);

  var taskInput = document.querySelector('.task-input');
  taskInput.focus();
  taskInput.addEventListener('keyup', handleEnterKey);

  // updates the display whenever the filter changes
  var filters = document.querySelector('.filters');
  filters.addEventListener('change', () => displayTasks());

}

function handleEnterKey(event) {
  if(event.key === 'Enter'){
    addTaskHandler(event);
  }
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

function updateTaskHandler(event, task) {
  var taskName = task.name;

  var taskInput = $('.task-input');
  var taskSubmitBtn = $('.task-add-btn');

  // setting the text to be updated
  taskInput.value = taskName;
  taskInput.removeEventListener('keyup', handleEnterKey);
  taskInput.addEventListener('keyup', handleEnterKeyWrapper);
  taskInput.focus();

  // changing the taskSubmitBtn for update
  taskSubmitBtn.innerText = 'Update Task';
  taskSubmitBtn.removeEventListener('click', addTaskHandler);
  taskSubmitBtn.addEventListener('click', updateTaskWrapper);

  // updateTaskWrapper
  function updateTaskWrapper(event) {
    var name = taskInput.value;

    updateTask(task.id, name, task.completed);

    // reset the taskInput and taskSubmitBtn
    taskInput.value = "";
    taskInput.removeEventListener('keyup', handleEnterKeyWrapper);
    taskInput.addEventListener('keyup', handleEnterKey);

    taskSubmitBtn.innerText = 'Add Task';
    taskSubmitBtn.removeEventListener('click', updateTaskWrapper);
    taskSubmitBtn.addEventListener('click', addTaskHandler);

    taskInput.focus();
  }

  function handleEnterKeyWrapper(event) {
    if(event.key === 'Enter'){
      updateTaskWrapper(event);
    }
  }
}


// API functions --------------------------------------------------------

function displayTasks() {
  var ul = document.querySelector('#tasks-list');
  ul.replaceChildren();

  var filteredTasks = tasks.list;

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
    updateBtn.addEventListener('click', (event) => updateTaskHandler(event, task));


    li.appendChild(p);
    li.appendChild(deleteBtn);
    li.appendChild(completeBtn);
    li.appendChild(updateBtn);

    ul.appendChild(li);
  });

  // focus on the taskInput
  setTimeout(() => $('.task-input').focus(), 100);

}

function addTask(id, name, completed=false){
  tasks.list = tasks.list.concat([{
    id,
    name,
    completed
  }]);

  // re-rendering the tasks on the webpage
  displayTasks();
}

/* Complete the task using the id*/
function completeTask(id) {
  // needs improvement 'cause map will run the function on the whole array
  // even if the target task is found
  tasks.list = tasks.list.map(function complete(task) {
    if(task.id === id){
      return {...task, completed: true};
    }

    return task;
  });

  displayTasks();
}

/* Update the task in the task array*/
function updateTask(id, name, completed = false) {
  if(!id || !name) return;

  tasks.list = tasks.list.map(function update(task) {
    if(task.id === id){
      return {
        id,
        name,
        completed
      };
    }

    return task;
  });

  displayTasks();

}

function deleteTask(id) {
  tasks.list = tasks.list.filter(function del(task) {
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
  return tasks.list.filter(function filter(task) {
    return task.completed === completed;
  });
}

/*
  - Simulate a 2-second delay using `setTimeout`.
  - Display tasks after they're "loaded."
  */
function loadTasks() {
  if(!localStorage.getItem('tasks')){
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  var tasks = {
    _tasks: JSON.parse(localStorage.getItem('tasks')),
    get list(){
      return this._tasks;
    },
    set list(tasksList){
      this._tasks = tasksList;
      console.log(this._tasks);

      // saving the new tasksList to localStorage
      localStorage.setItem('tasks', JSON.stringify(tasksList));
    }
  };

  setTimeout(function() {
    displayTasks();
  }, 2000);

  return tasks;
}

async function loadTasksAsync() {

}
