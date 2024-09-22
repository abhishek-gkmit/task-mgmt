var tasks;

// document.querySelector shortcut
var $ = function(selector) {
  return document.querySelector(selector);
}


document.addEventListener('DOMContentLoaded', function setup() {
  // tasks = loadTasks();
  loadTasksAsync().then((loadedTasks) => {
    console.log(loadedTasks);
    tasks = loadedTasks;
  });
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

  var priorityFilter = $('.priority-filter');
  priorityFilter.addEventListener('change', () => displayTasks());

}

function handleEnterKey(event) {
  if (event.key === 'Enter') {
    addTaskHandler(event);
  }
}


function addTaskHandler(event) {
  var taskInput = document.querySelector('.task-input');
  var taskPriority = $('.priority').value;
  // checking if the user had selected the priority or not
  taskPriority = taskPriority === 'all' ? 'normal' : taskPriority;
  var name = taskInput.value;

  if (!name) {
    console.log('Empty task can not be added');
    return;
  }

  // calling the API function and saving the task
  addTask(Date.now(), name, false, taskPriority);

  // clearing task after adding
  taskInput.value = '';
}

function updateTaskHandler(event, task) {
  var taskName = task.name;

  var taskInput = $('.task-input');
  var taskSubmitBtn = $('.task-add-btn');
  var taskPriority = $('.priority');
  var addTaskContainer = $('.add-task-container');

  var cancelTaskUpdate = document.createElement('button');
  cancelTaskUpdate.classList.add('cancel-task-btn');
  cancelTaskUpdate.innerText = 'Cancel';
  cancelTaskUpdate.addEventListener('click', cancelTaskUpdateHandler);
  addTaskContainer.appendChild(cancelTaskUpdate);

  addTaskContainer.classList.add('being-updated');

  // setting the text to be updated
  taskInput.value = taskName;
  taskInput.removeEventListener('keyup', handleEnterKey);
  taskInput.addEventListener('keyup', handleEnterKeyWrapper);
  taskInput.focus();

  // priority setting to update
  var preservedTaskPriority = taskPriority.value;
  taskPriority.value = task.priority;

  // changing the taskSubmitBtn for update
  taskSubmitBtn.innerText = 'Update Task';
  taskSubmitBtn.removeEventListener('click', addTaskHandler);
  taskSubmitBtn.addEventListener('click', updateTaskWrapper);

  // updateTaskWrapper
  function updateTaskWrapper(event) {
    var name = taskInput.value;
    var priority = taskPriority.value === 'all' ? 'normal' : taskPriority.value;

    updateTask(task.id, name, task.completed, priority);

    resetUI();
  }

  // cancel task update handler
  function cancelTaskUpdateHandler() {
    resetUI();
    addTaskContainer.removeChild(cancelTaskUpdate);
    addTaskContainer.classList.remove('being-updated');
  }

  function handleEnterKeyWrapper(event) {
    if (event.key === 'Enter') {
      updateTaskWrapper(event);
    }
  }

  function resetUI() {
    // reset the taskInput and taskSubmitBtn
    taskInput.value = "";
    taskInput.removeEventListener('keyup', handleEnterKeyWrapper);
    taskInput.addEventListener('keyup', handleEnterKey);

    taskPriority.value = preservedTaskPriority;

    taskSubmitBtn.innerText = 'Add Task';
    taskSubmitBtn.removeEventListener('click', updateTaskWrapper);
    taskSubmitBtn.addEventListener('click', addTaskHandler);

    taskInput.focus();

    addTaskContainer.removeChild(cancelTaskUpdate);
    addTaskContainer.classList.remove('being-updated');
  }
}


// API functions --------------------------------------------------------

function displayTasks() {
  var ul = document.querySelector('#tasks-list');
  ul.replaceChildren();

  // displaying tasks according to filter
  var filteredTasks = tasks.list;

  var filter = document.querySelector('.filters').value;
  if (filter === 'completed') {
    filteredTasks = filterTasks();
  } else if (filter === 'pending') {
    filteredTasks = filterTasks(false);
  }

  // sort filteredTasks according to priority
  var priorityFilter = $('.priority-filter').value;
  filteredTasks = sortWithPriority(filteredTasks, priorityFilter);

  filteredTasks.forEach(function taskToElement(task) {
    var li = document.createElement('li');
    li.classList.add('task-container');
    li.setAttribute('data-id', task.id);
    li.setAttribute('data-completed', task.completed);

    var p = document.createElement('p');
    p.classList.add('task-name');
    p.innerText = task.name;
    if (task.completed) {
      p.classList.add('completed-task');
    }


    var container = document.createElement('div');
    container.classList.add('btn-container');

    // delete, complete, update
    var deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.innerText = '❌';
    deleteBtn.setAttribute('title', 'Delete task');
    deleteBtn.addEventListener('click', (event) => deleteTask(task.id));

    var toggleBtn = document.createElement('button');
    toggleBtn.classList.add('complete-btn');
    toggleBtn.innerText = task.completed ? '☑️' : '✅';
    toggleBtn.setAttribute('title', task.completed ? 'Mark task as uncomplete' : 'Mark task as complete');
    toggleBtn.addEventListener('click', (event) => toggleTask(task.id));

    var updateBtn = document.createElement('button');
    updateBtn.classList.add('update-btn');
    if (task.completed) {
      updateBtn.disabled = true;
      updateBtn.innerText = '🔏';
      updateBtn.setAttribute('title', 'Completed tasks can not be edited');
    } else {
      updateBtn.innerText = '🖋';
      updateBtn.setAttribute('title', 'Edit task');
    }
    updateBtn.addEventListener('click', (event) => updateTaskHandler(event, task));

    var priority = document.createElement('p');
    priority.classList.add(task.priority);
    priority.innerText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);


    li.appendChild(p);
    container.appendChild(priority);
    container.appendChild(updateBtn);
    container.appendChild(toggleBtn);
    container.appendChild(deleteBtn);
    li.appendChild(container);

    ul.appendChild(li);
  });

  // focus on the taskInput
  setTimeout(() => $('.task-input').focus(), 100);

}

function addTask(id, name, completed = false, priority = 'normal') {
  tasks.list = tasks.list.concat([{
    id,
    name,
    completed,
    priority
  }]);

  // re-rendering the tasks on the webpage
  displayTasks();
}

/* Complete the task using the id*/
function toggleTask(id) {
  // needs improvement 'cause map will run the function on the whole array
  // even if the target task is found
  tasks.list = tasks.list.map(function complete(task) {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }

    return task;
  });

  displayTasks();
}

/* Update the task in the task array*/
function updateTask(id, name, completed = false, priority = "normal") {
  if (!id || !name) return;

  tasks.list = tasks.list.map(function update(task) {
    if (task.id === id) {
      return {
        id,
        name,
        completed,
        priority
      };
    }

    return task;
  });

  displayTasks();

}

function deleteTask(id) {
  tasks.list = tasks.list.filter(function del(task) {
    if (task.id === id) {
      return false;
    }

    return true;
  });

  displayTasks();
}

/* Filter the tasks according to the completed state
 * @param {boolean} completed: the filter
 * @returns {Array} Returns the new filtered array*/
function filterTasks(completed = true) {
  return tasks.list.filter(function filter(task) {
    return task.completed === completed;
  });
}

function loadTasks() {
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  var tasks = {
    _tasks: JSON.parse(localStorage.getItem('tasks')),
    get list() {
      return this._tasks;
    },
    set list(tasksList) {
      this._tasks = tasksList;

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
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify([]));
  }

  var tasks = {
    _tasks: JSON.parse(localStorage.getItem('tasks')),
    get list() {
      return this._tasks;
    },
    set list(tasksList) {
      this._tasks = tasksList;

      // saving the new tasksList to localStorage
      localStorage.setItem('tasks', JSON.stringify(tasksList));
    }
  };

  // displayTasks() will be called after this loadTasksAsync() function is resolved
  // Why? because loadTasksAsync() function will resolve immediately
  // and setTimeout() will take some time to call displayTasks() function
  setTimeout(function() {
    displayTasks();
  }, 2000);

  return tasks;

}

// EXTRA API functions
function sortWithPriority(filteredTasks, priority) {
  filteredTasks = filteredTasks.sort(function compare(a, b) {
    if (a.priority === priority) {
      // a should come before b
      return -1;
    } else if (b.priority === priority) {
      // b should come before a
      return 1;
    }

    // a and b both are equal
    return 0;
  });

  return filteredTasks;
}
