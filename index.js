document.addEventListener("DOMContentLoaded", function() {
  let draggedTask = null;

  function addTask(taskText) {
    var todoList = document.getElementById("todoList");
    var newTask = document.createElement("li");
    newTask.draggable = true; // Enable dragging for the new task
    newTask.addEventListener('dragstart', () => { // Add dragstart event listener
      draggedTask = newTask;
      newTask.classList.add('dragging');
    });
    newTask.addEventListener('dragend', () => { // Add dragend event listener
      newTask.classList.remove('dragging');
      draggedTask = null;
    });
    var taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "taskCheckbox";
    taskCheckbox.addEventListener("change", function() {
      if (this.checked) {
        todoList.appendChild(newTask); // Move checked task to the end of the list
      }
    });
    var taskLabel = document.createElement("label");
    taskLabel.appendChild(taskCheckbox);
    taskLabel.appendChild(document.createTextNode(taskText));
    newTask.appendChild(taskLabel);
    
    var deleteButton = document.createElement("button");
    deleteButton.className = "deleteBtn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deleteTask(newTask);
    });
    newTask.appendChild(deleteButton);
    
    todoList.insertBefore(newTask, todoList.firstChild); // Insert new task at the top of the list
  }
  
  function deleteTask(task) {
    var todoList = document.getElementById("todoList");
    todoList.removeChild(task);
  }
  
  document.getElementById("add").addEventListener("click", function() {
    var taskInput = document.getElementById("addTodo");
    var taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText);
      taskInput.value = "";
    } else {
      alert("Please enter a task!");
    }
  });

  document.getElementById("todoList").addEventListener("dragover", function(event) {
    event.preventDefault(); // Allow drop
    const afterTask = getAfterTask(event.clientY);
    const parent = document.getElementById("todoList");
    if (afterTask === null) {
      parent.appendChild(draggedTask);
    } else {
      parent.insertBefore(draggedTask, afterTask);
    }
  });

  document.getElementById("todoList").addEventListener('drop', function(event) {
    event.preventDefault(); // Prevent default drop action
    const parent = document.getElementById("todoList");
    parent.insertBefore(draggedTask, event.target);
  });

  function getAfterTask(y) {
    const tasks = [...document.querySelectorAll('#todoList li:not(.dragging)')];
    return tasks.reduce((closest, task) => {
      const box = task.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, task: task };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).task;
  }

  // Apply drag and drop functionality to existing tasks
  const tasks = document.querySelectorAll('#todoList li');
  tasks.forEach(task => {
    task.draggable = true;
    task.addEventListener('dragstart', () => {
      draggedTask = task;
      task.classList.add('dragging');
    });
    task.addEventListener('dragend', () => {
      task.classList.remove('dragging');
      draggedTask = null;
    });

    const deleteButton = task.querySelector('.deleteBtn');
    deleteButton.addEventListener('click', function() {
      deleteTask(task);
    });

    const taskCheckbox = task.querySelector('.taskCheckbox');
    taskCheckbox.addEventListener('change', function() {
      if (this.checked) {
        document.getElementById('todoList').appendChild(task);
      }
    });
  });

  // Move checked tasks to the end of the list
  const checkedTasks = document.querySelectorAll('#todoList li .taskCheckbox:checked');
  checkedTasks.forEach(task => {
    document.getElementById('todoList').appendChild(task.parentElement.parentElement);
  });
});