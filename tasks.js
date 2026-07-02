const modal = document.getElementById("task-modal");
const floatingBtn = document.querySelector(".floating-btn");
const modalcloseBtn = document.querySelector(".close-modal");
const categoriesList = document.querySelector("#categories-list");
const modalCategory = document.querySelector("#modal-category");
const modalTask = document.getElementById("modal-task");
const modalAddBtn = document.getElementById("modal-add-btn");
const tasksList = document.querySelector("#tasks-list");

let selectedCategory = "All";
let tasks = [];
let categories = [
    {
        name: "General"
    }, 
    {
        name: "College"
    }
];

function saveCategories(){
    localStorage.setItem("categories",JSON.stringify(categories));
}

function loadCategories(){
    let savedCategories = localStorage.getItem("categories");
    if(savedCategories){
        categories = JSON.parse(savedCategories);
    }
    else{
        saveCategories();
    }
}

//RENDER CATEGORY LIST
function renderCategories(){
    categoriesList.innerHTML = "";
    let li = document.createElement("li");
    li.innerText = "All";
    if (selectedCategory === "All") {
        li.classList.add("active-category");
    }
    li.addEventListener("click", function () {
        selectedCategory = "All";
        renderTasks();
        renderCategories();
    });
    categoriesList.appendChild(li);
    categories.forEach(function(category){
        let li = document.createElement("li");
        li.innerText = category.name;
        if (selectedCategory === category.name) {
            li.classList.add("active-category");
        }
        li.addEventListener("click", function () {
            selectedCategory = category.name;
            renderTasks();
            renderCategories();
        });
        categoriesList.appendChild(li);
    });
}

function renderCategoriesDropdown(){
    modalCategory.innerHTML = "";
    categories.forEach(function(category){
        let option = document.createElement("option");
        option.innerText = category.name;
        option.value = category.name;
        modalCategory.appendChild(option);
    });
}

//FLOATING ADD BUTTON
floatingBtn.addEventListener("click", function(){
    modal.classList.add("show");
    modalTask.value = "";
});

//MODAL CLOSE BUTTON
modalcloseBtn.addEventListener("click",function () {
    modal.classList.remove("show");
});

//MODAL CLOSE ESCAPE KEY FUNCITONALITY
document.addEventListener("keydown",function(event) {
    if(event.key == "Escape")modal.classList.remove("show");
})

document.addEventListener("keydown", function (event){ 
    if(event.key == "Enter"){
        addTask();
        modal.classList.remove("show");
        renderTasks();
    }
})

//TASKS 

function addTask(){
    let task = modalTask.value.trim();
    let ctg = modalCategory.value.trim();
    if(task == ""){
        alert("Enter a task");
        return;
    }
    let task_obj = {
        text: task,
        completed: false,
        category: ctg
    }
    tasks.push(task_obj);
    modal.classList.remove("show");
}

//SAVING TASKS
function saveTasks(){
    let t = JSON.stringify(tasks);
    localStorage.setItem("tasks",t);
}
//LOADING TASKS
function loadTasks(){
    let savedTasks = localStorage.getItem("tasks");
    if(savedTasks){
        tasks = JSON.parse(savedTasks);
        renderTasks();
    }
    else{
        saveTasks();
    }
}

function renderTasks(){
    tasksList.innerHTML = "";
    tasks.forEach((task,index) => {
        if (
            selectedCategory !== "All" &&
            task.category !== selectedCategory
        ){
            return;
        }
        let li = document.createElement("li");
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        let span = document.createElement("span");
        span.innerText = task.text;
        let badge = document.createElement("span");
        badge.innerText = task.category;
        badge.classList.add("category-badge");
        if(task.completed == true){
            span.classList.add("completed-text");
            li.classList.add("completed");
        }
        const del = document.createElement("button");
        del.innerText = "X";
        del.classList.add("delete-btn");
        let left = document.createElement("div");
        left.classList.add("task-left");

        left.appendChild(checkbox);
        left.appendChild(span);

        if(selectedCategory === "All"){
            left.appendChild(badge);
        }
        li.appendChild(left);
        li.appendChild(del);
        li.classList.add("task-list-ele");
        tasksList.appendChild(li);    
        del.addEventListener("click", function (){
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        })

        checkbox.addEventListener("change",function() {
            if(task.completed == false){
                task.completed = true;
                saveTasks();
                renderTasks();
            }
            else{
                task.completed = false;
                saveTasks();
                renderTasks();
            }
        })
    });
}

modalAddBtn.addEventListener("click", function(){
    addTask();
    modalTask.value = "";
    saveTasks();
    renderTasks();
});

document.querySelectorAll(".coming-soon").forEach(item => {
    item.addEventListener("click", function () {
        alert("🚧 This feature is coming in a future FlowState update!");
    });
});

loadTasks();
renderTasks();
loadCategories();
renderCategories();
renderCategoriesDropdown();