const loadTodoTitles = function () {
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodoTitleList);
  xmlReq.open('GET','/getTodos');
  xmlReq.send();
}

const displayTodoTitleList = function () {
  let titles = this.responseText;
  document.getElementById('contents').innerHTML = titles;
}

const getTodo = function(id) {
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodo);
  xmlReq.open('POST','/getTodo');
  xmlReq.send(`todoId=${id}`);
}

const displayTodo = function(){
  let todo = this.responseText;
  document.getElementById('contents').innerHTML = todo;
}

const addTask = function () {
  let objective = document.getElementById("item").value;
  let todoId =+document.getElementById("todoId").textContent;
  if(objective=="") return;
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodo);
  xmlReq.open('POST','/addTodoItem');
  xmlReq.send(`todoId=${todoId}&&objective=${objective}`);
}

const changeStatus= function(id){
  let todoId = +document.getElementById("todoId").textContent;
  let links = {
    true : '/markItem',
    false : '/unmarkItem'
  }
  let status = document.getElementById(id).checked;
  let url =  links[status];
  let xmlReq = new XMLHttpRequest();
  xmlReq.open('POST',url);
  xmlReq.send(`todoId=${todoId}&&itemId=${id}`);
}

const editTitle = function(id){
  let title = document.getElementById(id).innerText;
  let newTitle = `<input onkeydown='modifyTitle(event)' id='newTitle' value='${title}'/>`
  document.getElementById(id).innerHTML = newTitle;
}

const editDescription = function(id){
  let description = document.getElementById(id).innerText;
  let newDescription = `<input onkeydown='modifyDescription(event)' id='newDescription' value='${description}'/>`
  document.getElementById(id).innerHTML = newDescription;
}

const editItem = function(id){
  let objective = document.getElementById(id).innerText;
  let newObjective = `<input id='newObjective' value='${objective}'/>`
  document.getElementById(id).innerHTML = newObjective;
}

const modifyTitle = function(event){
  let url;
  let queryString;
  let todoId = +document.getElementById('todoId').textContent;
  let newTitle = document.getElementById('newTitle').value;
  if(event.key=='Enter'&& newTitle !=""){
    modifyTodoTitle(todoId,newTitle);
  }
  if(event.key=='Enter'&& newTitle ==""){
    deleteTodo(todoId)
  }
  if(event.key=='Escape'){
    getTodo(todoId);
    return;
  }
}

const modifyTodoTitle = function(todoId,newTitle) {
  url='/modifyTodoTitle'
  queryString =`todoTitle=${newTitle}&todoId=${todoId}`
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodo);
  xmlReq.open('POST',url);
  xmlReq.send(queryString);
}

const modifyDescription = function(event){
  let url;
  let queryString;
  let todoId = +document.getElementById('todoId').textContent;
  let newDescription = document.getElementById('newDescription').value;
  if(event.key=='Enter'){
    modifyTodoDescription(todoId,newDescription);
  }
  if(event.key=='Escape'){
    getTodo(todoId);
    return;
  }
}

const modifyTodoDescription = function (todoId,newDescription) {
  url='/modifyTodoDescription'
  queryString =`todoDescription=${newDescription}&todoId=${todoId}`
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodo);
  xmlReq.open('POST',url);
  xmlReq.send(queryString);
}
const deleteTodo = function(todoId) {
  console.log("in");
  url='/deleteTodo'
  queryString =`todoId=${todoId}`
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',loadTodoTitles);
  xmlReq.open('POST',url);
  xmlReq.send(queryString);
  return;
}

window.onload = loadTodoTitles;
