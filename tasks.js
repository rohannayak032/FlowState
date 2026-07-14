const modal = document.getElementById("task-modal");
const floatingBtn = document.querySelector(".floating-btn");
const modalcloseBtn = document.querySelector(".close-modal");
const categoriesList = document.querySelector("#categories-list");
const modalCategory = document.querySelector("#modal-category");
const modalTask = document.getElementById("modal-task");
const modalAddBtn = document.getElementById("modal-add-btn");
const tasksList = document.querySelector("#tasks-list");
const categoryModal = document.getElementById("category-modal");
const addCategoryBtn = document.getElementById("add-category-btn");
const closeCategoryBtn = document.querySelector(".close-category-modal");
const categoryName = document.getElementById("category-name");
const createCategoryBtn = document.getElementById("create-category-btn");

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

addCategoryBtn.addEventListener("click", function () {
    categoryModal.classList.add("show");
    categoryName.value = "";
})

closeCategoryBtn.addEventListener("click", function () {
    categoryModal.classList.remove("show");
    categoryName.value = "";
});




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
function renderCategories() {
    categoriesList.innerHTML = "";
    let allLi = document.createElement("li");
    allLi.textContent = "All";
    if (selectedCategory === "All") {
        allLi.classList.add("active-category");
    }
    allLi.addEventListener("click", function () {
        selectedCategory = "All";
        renderTasks();
        renderCategories();
    });
    categoriesList.appendChild(allLi);
    categories.forEach(function (category, index) {
        let li = document.createElement("li");

        let span = document.createElement("span");
        span.textContent = category.name;

        li.appendChild(span);

        if (index >= 2) {

            let btn = document.createElement("button");
            btn.innerHTML = "🗑️";
            btn.classList.add("delete-category-btn");

            btn.addEventListener("click", function (event) {
                event.stopPropagation();
                let hasTasks = tasks.some(function(task) {
                    return task.category === category.name;
                });
                if (hasTasks) {
                    alert("This category still contains tasks!");
                    return;
                }
                categories.splice(index, 1);
                if (selectedCategory === category.name) {
                    selectedCategory = "All";
                }
                saveCategories();
                renderCategories();
                renderCategoriesDropdown();
                renderTasks();
            });

            li.appendChild(btn);
        }

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
document.addEventListener("keydown", function(event) {
    if(event.key === "Escape"){
        modal.classList.remove("show");
        categoryModal.classList.remove("show");

        modalTask.value = "";
        categoryName.value = "";
    }
});
modalTask.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
        saveTasks();
        renderTasks();
        modal.classList.remove("show");
    }
});

categoryName.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        createCategoryBtn.click();
    }
});
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
    modalTask.value = "";
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
    const pendingTasks = tasks.filter(task => task.completed === false)
    const completedTasks = tasks.filter(task => task.completed === true)
    const orderedTasks = [...pendingTasks, ...completedTasks];
    tasksList.innerHTML = "";
    orderedTasks.forEach((task,index) => {
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
        if(task.completed === true){
            span.classList.add("completed-text");
            li.classList.add("completed");
        }
        const del = document.createElement("button");
        del.innerHTML = "&times;";
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
            const originalIndex = tasks.indexOf(task);
            if (originalIndex !== -1) {
                tasks.splice(originalIndex, 1);
            }
            saveTasks();
            renderTasks();
        })


        checkbox.addEventListener("change",function() {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
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

createCategoryBtn.addEventListener("click", function(){
    let name = categoryName.value.trim();
    if(name == ""){
        alert("Enter a category list name!");
        return;
    }
    const exists = categories.some(function (category) {
        return category.name.toLowerCase() === name.toLowerCase();
    });
    if (exists){
        alert("Category already exists!");
        return;
    }
    let category = {
        name: name
    }
    categories.push(category);
    saveCategories();
    renderCategories();
    renderCategoriesDropdown();

    categoryModal.classList.remove("show");
    categoryName.value = "";
});

loadTasks();
loadCategories();
renderCategories();
renderCategoriesDropdown();

