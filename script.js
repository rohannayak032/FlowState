let tasks = [];
let categories = [
    {
        name: "General"
    }, 
    {
        name: "College"
    }
];
const categoriesDropdown = document.getElementById("category");
const addbtn = document.getElementById("add-task-btn");
let task_input = document.getElementById("task-input");    
let tot_count = document.querySelector("#tot-count");
let rem_count = document.querySelector("#rem-count");
let comp_count = document.querySelector("#comp-count");
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.querySelector(".sidebar");


//SIDEBAR TOGGLE BUTTON FUNCTIONALITY
toggleBtn.addEventListener("click", function(){
    sidebar.classList.toggle("open");
})


//ADD TASK
function addTask() {
    let task = task_input.value;
    if(task.trim()==""){
        alert("Please enter a task");
        return;
    }
    let task_obj = {
        text: task,
        completed: false,
        category: categoriesDropdown.value
    }
    tasks.push(task_obj);
    saveTasks();
    renderDashboard();
    task_input.value = "";
}

//ENTER KEY FUNCTIONALITY
task_input.addEventListener("keydown", function(event) {
    if(event.key=="Enter"){
        addTask();
    }
})
addbtn.addEventListener("click", addTask);

//SAVING TASKS
function saveTasks(){
    let t = JSON.stringify(tasks);
    localStorage.setItem("tasks",t);
    renderDashboard();
}
//LOADING TASKS
function loadTasks(){
    let savedTasks = localStorage.getItem("tasks");
    if(savedTasks){
        tasks = JSON.parse(savedTasks);
    }
    else{
        saveTasks();
    }
}

function renderDashboard(){
    let rc = 0;
    let cc = 0;
    tot_count.innerText = tasks.length;
    for(let task of tasks){
        if(task.completed==true){
            cc++;
        }
        else{
            rc++;
        }
    }
    rem_count.innerText = rc;
    comp_count.innerText = cc;
}   

//CATEGORIES 
function loadCategories(){
    let savedCategories = localStorage.getItem("categories");
    if(savedCategories){
        categories = JSON.parse(savedCategories);
    }
    else{
        saveCategories();
    }
}
function renderCategoriesDropdown(){
        categoriesDropdown.innerHTML = "";
        categories.forEach(function(category){
        let option = document.createElement("option");
        option.innerText = category.name;
        option.value = category.name;
        categoriesDropdown.appendChild(option);
    });
}
function saveCategories(){
    localStorage.setItem("categories", JSON.stringify(categories));
}

document.querySelectorAll(".coming-soon").forEach(item => {
    item.addEventListener("click", function () {
        alert("🚧 This feature is coming in a future FlowState update!");
    });
});

loadTasks();
renderDashboard();
loadCategories();
renderCategoriesDropdown();