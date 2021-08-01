
// array of different colors
let colorArray = ['#FF6633', '#ff8787', '#FF33FF', '#FFFF99', '#00B3E6','#f5c347', '#4dffea', '#ffc45e', '#99FF99', '#f26363', '#c3f24e', '#809900', '#61bf47', '#db8fac', '#b8e86f', '#5bfafc', '#CCFF1A', '#FF1A66', '#ffa599', '#33FFCC', '#66994D', '#f5c6b3', '#4D8000', '#B33300', '#CC80CC', '#eed4ff', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399', '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#f2f29d', '#dd48ab', '#E6FF80', '#1AFF33', '#32d9ce','#ff80b0', '#CCCC00', '#66E64D', '#cacc4d', '#db45f5', '#ffc4ef', '#2bff95', '#FF4D4D', '#99E6E6', '#6666FF'];


let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let undoDeleteBtn =document.getElementById('undoDeleteBtn');

// function to get the saved todoList from local storage
function getTodoListFromLocalStorage() {
  let stringifiedTodoList = localStorage.getItem("todoList");
  let parsedTodoList = JSON.parse(stringifiedTodoList);
  if (parsedTodoList === null) {
    return [];
  } else {
    return parsedTodoList;
  }
}

let todoList = getTodoListFromLocalStorage();
let removedItems = [];
let todosCount = todoList.length;

// eventListener for SAVE button
saveTodoButton.onclick = function() {
  //this loop is to update the ids of elements in todoList since some items may
  //been deleted
  for(let i = 0; i < todoList.length; i++){
    todoList[i].uniqueNo = i+1;
  }
  localStorage.setItem("todoList", JSON.stringify(todoList));
  removedItems = [];
};

//function to add a new todo task in the todo list
function onAddTodo() {
  let userInputElement = document.getElementById("todoUserInput");
  let userInputValue = userInputElement.value;

  if (userInputValue === "") {
    alert("Enter Valid Text");
    return;
  }

  todosCount = todosCount + 1;
  let colorIndex = Math.floor(Math.random()*50);
  let newTodo = {
    text: userInputValue,
    uniqueNo: todosCount,
    isChecked: false,
    color: colorArray[colorIndex]+'66'
  };
  todoList.push(newTodo);
  createAndAppendTodo(newTodo);
  userInputElement.value = "";
}

// eventListener for ADD button
addTodoButton.onclick = function() {
  onAddTodo();
};

//function to change the checked status of todo item when clicked on checkbox
function onTodoStatusChange(checkboxId, labelId, todoId) {
  let checkboxElement = document.getElementById(checkboxId);
  let labelElement = document.getElementById(labelId);
  labelElement.classList.toggle("checked");

  //getting index of todo item from todo list
  let todoObjectIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;

    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  //change the status in todolist
  let todoObject = todoList[todoObjectIndex];

  if(todoObject.isChecked === true){
    todoObject.isChecked = false;
  } else {
    todoObject.isChecked = true;
  }

}

//function to delete todo item when clicked on delete icon
function onDeleteTodo(todoId) {
  let todoElement = document.getElementById(todoId);
  todoItemsContainer.removeChild(todoElement);

  let deleteElementIndex = todoList.findIndex(function(eachTodo) {
    let eachTodoId = "todo" + eachTodo.uniqueNo;
    if (eachTodoId === todoId) {
      return true;
    } else {
      return false;
    }
  });

  let deletedItem = todoList.splice(deleteElementIndex, 1);
  //adding deleted items to removed item stack
  removedItems.push({
    item: deletedItem[0],
    index: deleteElementIndex
  });
}

//function to edit todo item
function onEditTodo(labelId){
  let updatedTask = prompt("Enter updated task:");
  if(updatedTask === null || updatedTask === ""){
    return;
  }
  let labelElement = document.getElementById(labelId);
  labelElement.textContent = updatedTask;
  
  let updatedItemIndex = todoList.findIndex(function(eachTodo){
    let eachLabel = "label" + eachTodo.uniqueNo;
    if(eachLabel === labelId){
      return true;
    } else{
      return false;
    }
  });

  todoList[updatedItemIndex].text = updatedTask;
}

//function to create and add todo item in HTML using DOM manipulation
function createAndAppendTodo(todo) {
  let todoId = "todo" + todo.uniqueNo;
  let checkboxId = "checkbox" + todo.uniqueNo;
  let labelId = "label" + todo.uniqueNo;

  let todoElement = document.createElement("li");
  todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
  todoElement.id = todoId;
  todoItemsContainer.appendChild(todoElement);

  let inputElement = document.createElement("input");
  inputElement.type = "checkbox";
  inputElement.id = checkboxId;
  inputElement.checked = todo.isChecked;

  inputElement.onclick = function () {
    onTodoStatusChange(checkboxId, labelId, todoId);
  };

  inputElement.classList.add("checkbox-input");
  todoElement.appendChild(inputElement);

  let labelContainer = document.createElement("div");
  labelContainer.classList.add("label-container", "d-flex", "flex-row");
  labelContainer.style.backgroundColor = todo.color;
  todoElement.appendChild(labelContainer);

  let labelElement = document.createElement("label");
  labelElement.setAttribute("for", checkboxId);
  labelElement.id = labelId;
  labelElement.classList.add("checkbox-label");
  labelElement.textContent = todo.text;
  if (todo.isChecked === true) {
    labelElement.classList.add("checked");
  }
  labelContainer.appendChild(labelElement);

  let iconsContainer = document.createElement('div');
  iconsContainer.classList.add('icons-container');
  labelContainer.appendChild(iconsContainer);

  let editIcon = document.createElement('i');
  editIcon.classList.add('fas', 'fa-edit', 'icon');
  editIcon.setAttribute('title', 'Edit task');

  editIcon.onclick = function(){
    onEditTodo(labelId);
  }

  iconsContainer.appendChild(editIcon);

  let deleteIcon = document.createElement("i");
  deleteIcon.classList.add("far", "fa-trash-alt", "icon");
  deleteIcon.setAttribute('title', 'Delete Task');

  deleteIcon.onclick = function () {
      onDeleteTodo(todoId);
  };

  iconsContainer.appendChild(deleteIcon);
}

//function to undo delete
undoDeleteBtn.onclick = function(){
  if(removedItems.length === 0){
    alert("No items deleted");
    return;
  }
  let deletedItem = removedItems.pop();
  let todoItem = deletedItem.item;
  let deletedItemIndex = deletedItem.index;
  todoList.splice(deletedItemIndex, 0, todoItem);
  todoItemsContainer.innerHTML = "";
  createList();
}

function createList(){
  for (let todo of todoList) {
    createAndAppendTodo(todo);
  }
}

createList();