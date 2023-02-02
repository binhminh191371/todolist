const taskInput = document.getElementById("new-task");
const addButton = document.getElementsByTagName("button")[0];
const incompleteTasksHolder = document.getElementById("incomplete-tasks");
const completedTasksHolder = document.getElementById("completed-tasks");
const listPages = document.querySelector(".pages");
const endPoint = "https://jsonplaceholder.typicode.com/users/1/todos";
const displayTitle = document.querySelector(".title");
const Loading = document.querySelector(".loader");
const container = document.querySelector(".container");
const axiosInstance = axios.create();
const tempCover = `<div class="cover"></div>`;
//Add a request interceptor
async function handlePageNumber(number) {
  await new Promise((res, reject) => {
    container.insertAdjacentHTML("afterbegin", tempCover);
    Loading.style.display = "block";

    setTimeout(res(), 2000);
  });

  currentPage = number;
  perTitles = titlesPage.slice(
    (currentPage - 1) * perPage,
    (currentPage - 1) * perPage + perPage
  );
  container.removeChild(container.firstChild);
  incompleteTasksHolder.innerHTML = "";
  completedTasksHolder.innerHTML = "";

  renderTitles();
}
axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    addButton.addEventListener("click", addTask);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let titlesPage = [];
let currentPage = 1;
let perPage = 4;
let totalPage = 0;
let perTitles = [];

async function getTitles() {
  try {
    let data = await axiosInstance.get(`${endPoint}`);

    titlesPage = data.data;
    perTitles = titlesPage.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    );

    renderPages();
    renderTitles();
  } catch (e) {
    console.log(e);
  }
}
getTitles();

async function handlePageNumber(number) {
  await new Promise((res, reject) => {
    Loading.style.display = "block";
    container.insertAdjacentHTML("afterbegin", tempCover);
    setTimeout(res, 2000);
  });

  currentPage = number;
  perTitles = titlesPage.slice(
    (currentPage - 1) * perPage,
    (currentPage - 1) * perPage + perPage
  );
  container.removeChild(container.firstChild);
  incompleteTasksHolder.innerHTML = "";
  completedTasksHolder.innerHTML = "";

  renderTitles();
  Loading.style.display = "none";
}

function renderPages() {
  totalPage = titlesPage.length / perPage;
  for (let index = 1; index <= totalPage; index++) {
    listPages.innerHTML += `<li class="page" onclick='handlePageNumber(${index})'>${index}</li>`;
  }
}

function renderTitles() {
  [...perTitles].map((item) => {
    const tempIncomplete = ` <li >
        <input type="checkbox" class="input_checkbox " checked /><label >${item.title}</label
        > <input type="text"> <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button
        ><button class="delete"><i class="fa-solid fa-trash"></i></button>
      </li>`;
    const tempComplete = ` <li >
      <input type="checkbox" class="input_checkbox "  /><label >${item.title}</label
      ><input type="text"> <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button
      ><button class="delete"><i class="fa-solid fa-trash"></i></button>
    </li>`;

    if (item.completed) {
      incompleteTasksHolder.insertAdjacentHTML("afterbegin", tempComplete);
    } else {
      completedTasksHolder.insertAdjacentHTML("afterbegin", tempIncomplete);
    }

    initData();
  });
}

const createNewTaskElement = function (taskString) {
  const listItem = document.createElement("li");
  const checkBox = document.createElement("input");
  const label = document.createElement("label");
  const editInput = document.createElement("input");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");
  checkBox.type = "checkbox";
  editInput.type = "text";

  editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
  editButton.className = "edit";
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
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
async function addTask() {
  await new Promise((res, reject) => {
    Loading.style.display = "block";
    container.insertAdjacentHTML("afterbegin", tempCover);
    setTimeout(res, 2000);
  });
  const item = createNewTaskElement(taskInput.value);
  incompleteTasksHolder.appendChild(item);
  bindTaskEvents(item, taskCompleted);
  taskInput.value = "";
  Loading.style.display = "none";
  container.removeChild(container.firstChild);
}

//Edit an existing task
function editTask() {
  const item = this.parentNode;

  const editInput = item.querySelector("input[type=text");
  const label = item.querySelector("label");
  const containsClass = item.classList.contains("editMode");

  if (containsClass) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }

  item.classList.toggle("editMode");
}

//Delete an existing task
function deleteTask() {
  const item = this.parentNode;
  const ul = item.parentNode;

  //Remove the parent list item from the ul
  ul.removeChild(item);
}

//Mark a task as complete
function taskCompleted() {
  const listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
}

//Mark a task as incomplete
function taskIncomplete() {
  const listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
}

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
  const checkBox = taskListItem.querySelector("input[type=checkbox]");
  const editButton = taskListItem.querySelector("button.edit");
  const deleteButton = taskListItem.querySelector("button.delete");

  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
}

const initData = () => {
  for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  for (let i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }
};

//Set the click handler to the addTask function

initData();
