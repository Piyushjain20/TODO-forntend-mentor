// task class : repesent a task
class Task {
  constructor(taskName) {
    this.taskName = taskName;
    this.isActive = true;
  }
}
// ui class: handle ui task
const maxCount = 6; // maxCount of task items displayed at a time.
class UI {
  static currentCount = 0;
  static userThemePreference = 0; //0 for dark & 1 fro light
  static displayTask(status) {
    const allTasks = Store.getTask(status);
    allTasks.forEach((task) => UI.addTaskToList(task));
  }
  static addTaskToList(task) {
    if (this.currentCount >= maxCount) return;
    else {
      let grid2 = document.querySelector(".grid-2");
      let div = document.createElement("div");
      if (task.isActive) div.className = "card";
      else div.className = "card completed";
      div.innerHTML = `
        <input type="checkbox" class="checkBtn" />
        <p>${task.taskName}</p>
    `;
      //<i class="fa-regular fa-xmark-large"></i>
      UI.clearInput();
      grid2.appendChild(div);
      UI.currentCount++;
    }
  }
  static statusChange(taskCard) {
    taskCard.classList.toggle("completed");
  }
  static deleteTask(taskCard) {
    taskCard.remove();
  }
  static clearInput() {
    let newTask = document.getElementById("newTask");
    newTask.value = "";
  }
  static refresh() {
    let grid2 = document.querySelector(".grid-2");
    grid2.innerHTML = "";
    UI.currentCount = 0;
  }
  static changeTheme(num) {
    let html = document.querySelector(":root");
    if (num == 0) {
      html.style.setProperty("--img1", "url(./images/bg-desktop-dark.jpg)");
      html.style.setProperty("--img2", "url(./images/bg-mobile-dark.jpg)");
      html.style.setProperty("--bodyBG", "hsl(235, 21%, 11%)");
      html.style.setProperty("--cardBG", "hsl(235, 24%, 19%)");
      html.style.setProperty("--btnHvr", "hsl(236, 33%, 92%)");
      html.style.setProperty("--btn", "hsl(234, 11%, 52%)");
      html.style.setProperty("--pCompleted", "hsl(233, 14%, 35%)");
      html.style.setProperty("--pHvr", "hsl(236, 33%, 92%)");
      html.style.setProperty("--p", "hsl(234, 39%, 85%)");
    } else {
      html.style.setProperty("--img1", "url(./images/bg-desktop-light.jpg)");
      html.style.setProperty("--img2", "url(./images/bg-mobile-light.jpg)");
      html.style.setProperty("--bodyBG", "hsl(236, 33%, 92%)");
      html.style.setProperty("--cardBG", "hsl(0, 0%, 98%)");
      html.style.setProperty("--btnHvr", "hsl(235, 19%, 35%)");
      html.style.setProperty("--btn", "hsl(234, 11%, 52%)");
      html.style.setProperty("--pCompleted", "hsl(233, 11%, 84%)");
      html.style.setProperty("--pHvr", "hsl(235, 19%, 35%)");
      html.style.setProperty("--p", "hsl(235, 19%, 35%)");
    }
  }
}
//storage class :  handles storage
class Store {
  static getTask(status) {
    let tasks;
    if (localStorage.getItem("tasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    if (status === "all") return tasks;
    else if (status === "active") return tasks.filter((task) => task.isActive);
    else return tasks.filter((task) => !task.isActive);
  }
  static addTask(task) {
    const tasks = Store.getTask("all");
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  static toggleStatus(taskName) {
    const tasks = Store.getTask("all");
    tasks.forEach((task, index) => {
      if (task.taskName == taskName) {
        tasks[index].isActive = !tasks[index].isActive;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  static removeTask(taskName) {
    const tasks = Store.getTask("all");
    tasks.forEach((task, i) => {
      if (task.taskName == taskName) {
        tasks.splice(i, 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  static removeAllCompletedTask() {
    const tasks = Store.getTask("all");
    tasks.forEach((task, i) => {
      if (task.isActive == false) {
        tasks.splice(i, 1);
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

// event to display task
document.addEventListener("DOMContentLoaded", UI.displayTask("all"));

//event to add task
let addBtn = document.querySelector(".addBtn");
let newTask = document.getElementById("newTask");
addBtn.addEventListener("click", (e) => {
  const task = new Task(newTask.value);
  Store.addTask(task);
  UI.clearInput();
  UI.addTaskToList(task);
});
newTask.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    const task = new Task(newTask.value);
    Store.addTask(task);
    UI.clearInput();
    UI.addTaskToList(task);
  }
});

// event to change task status
let checkBtn = document.querySelector(".grid-2");
checkBtn.addEventListener("click", (e) => {
  if (e.target.className === "checkBtn") {
    Store.toggleStatus(e.target.nextElementSibling.textContent);
    UI.statusChange(e.target.parentElement);
  }
});
// event to delete a task
let deleteBtn = document.querySelector(".grid-2");
deleteBtn.addEventListener("click", (e) => {
  var rect = e.target.getBoundingClientRect();
  // console.log(rect);
  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top; //y position within the element.
  // console.log(x + "       " + y);
  if (x / rect.width >= 0.9 && x / rect.width <= 0.95) {
    Store.removeTask(e.target.querySelector("p").textContent);
    UI.deleteTask(e.target);
    UI.refresh();
    UI.displayTask("all");
  }
});

// event to delete all complete task
let deleteCompleted = document.querySelector("#clearCompleted");
let allDisplayedTask = document.querySelectorAll(".card");
deleteCompleted.addEventListener("click", () => {
  UI.refresh();
  Store.removeAllCompletedTask();
  UI.displayTask("all");
});
//event to display all
let allBtn = document.getElementById("all");
allBtn.addEventListener("click", () => {
  activeBtn.classList.remove("selected");
  allBtn.classList.add("selected");
  completedBtn.classList.remove("selected");
  UI.refresh();
  UI.displayTask("all");
});
//event to sort by all active
let activeBtn = document.getElementById("active");
activeBtn.addEventListener("click", () => {
  activeBtn.classList.add("selected");
  allBtn.classList.remove("selected");
  completedBtn.classList.remove("selected");
  UI.refresh();
  UI.displayTask("active");
});
//event to sort by all completed
let completedBtn = document.getElementById("completed");
completedBtn.addEventListener("click", () => {
  activeBtn.classList.remove("selected");
  allBtn.classList.remove("selected");
  completedBtn.classList.add("selected");
  UI.refresh();
  UI.displayTask("completed");
});
// event to switch theme
let themeBtn = document.querySelector(".fa-sun");
themeBtn.addEventListener("click", () => {
  themeBtn.classList.toggle("fa-moon");
  UI.userThemePreference = (UI.userThemePreference + 1) % 2;
  UI.changeTheme(UI.userThemePreference);
});
