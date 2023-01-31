const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const incompleteTasksHolder = document.getElementById("incomplete-tasks");
const completedTasksHolder = document.getElementById("completed-tasks");

const endPoint = "https://jsonplaceholder.typicode.com/users/1/todos";
const displayTitle = document.querySelector(".title");

async function getTitles() {
  const promise = await fetch(`${endPoint}`);
  const data = await promise.json();
  return data;
}
const titles = getTitles().then((results) =>
  results.map((item) => {
    const tempIncomplete = ` <li class="item${item.id}">
        <input type="checkbox" class="input_checkbox " checked /><label >${item.title}</label
        > <input type="text"> <button class="edit">Edit</button
        ><button class="delete">Delete</button>
      </li>`;
    const tempComplete = ` <li class="item${item.id}">
      <input type="checkbox" class="input_checkbox "  /><label >${item.title}</label
      ><input type="text"> <button class="edit">Edit</button
      ><button class="delete">Delete</button>
    </li>`;
    if (item.completed === false) {
      completedTasksHolder.insertAdjacentHTML("afterbegin", tempIncomplete);
    }
    if (item.completed === true) {
      incompleteTasksHolder.insertAdjacentHTML("afterbegin", tempComplete);
    }

    const createNewTaskElement = function (taskString) {
      var listItem = document.createElement("li");
      var checkBox = document.createElement("input");
      var label = document.createElement("label");
      var editInput = document.createElement("input");
      var editButton = document.createElement("button");
      var deleteButton = document.createElement("button");
      checkBox.type = "checkbox";
      editInput.type = "text";

      editButton.innerText = "Edit";
      editButton.className = "edit";
      deleteButton.innerText = "Delete";
      deleteButton.className = "delete";

      label.innerText = taskString;

      listItem.appendChild(checkBox);
      listItem.appendChild(label);
      listItem.appendChild(editInput);
      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);

      return listItem;
    };

    // add task
    const addTask = function () {
      var listItem = createNewTaskElement(taskInput.value);
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted);

      taskInput.value = "";
    };

    //Edit an existing task
    const editTask = function () {
      var listItem = this.parentNode;
      console.log(listItem);

      var editInput = listItem.querySelector("input[type=text");
      var label = listItem.querySelector("label");
      var containsClass = listItem.classList.contains("editMode");

      if (containsClass) {
        label.innerText = editInput.value;
      } else {
        editInput.value = label.innerText;
      }

      listItem.classList.toggle("editMode");
    };

    //Delete an existing task
    const deleteTask = function () {
      var listItem = this.parentNode;
      var ul = listItem.parentNode;

      //Remove the parent list item from the ul
      ul.removeChild(listItem);
    };

    //Mark a task as complete
    const taskCompleted = function () {
      var listItem = this.parentNode;
      completedTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskIncomplete);
    };

    //Mark a task as incomplete
    const taskIncomplete = function () {
      var listItem = this.parentNode;
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted);
    };

    const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
      var checkBox = taskListItem.querySelector("input[type=checkbox]");
      var editButton = taskListItem.querySelector("button.edit");
      var deleteButton = taskListItem.querySelector("button.delete");

      editButton.onclick = editTask;
      deleteButton.onclick = deleteTask;
      checkBox.onchange = checkBoxEventHandler;
    };

    //Set the click handler to the addTask function
    addButton.addEventListener("click", addTask);

    for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
      bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
    }

    for (let i = 0; i < completedTasksHolder.children.length; i++) {
      bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
    }
  })
);
