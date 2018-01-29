const loadTodoTitles = function () {
  sendAjaxRequest("GET",'/getTodos',displayTodoTitleList);
  return;
}

const sendAjaxRequest = function(method,url,callBack,reqBody=''){
  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',callBack);
  xmlReq.open(method,url);
  if(reqBody){
    xmlReq.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    xmlReq.send(reqBody);
    return;
  }
  xmlReq.send();
}

const noAction = function () {

}

const displayTodoTitleList = function () {
  let titles = this.responseText;
  document.getElementById('contents').innerHTML = titles;
}

const getTodo = function(id) {
  sendAjaxRequest("POST",'/getTodo',displayTodo,`todoId=${id}`);
}

const displayTodo = function(){
  let todo = this.responseText;
  document.getElementById('contents').innerHTML = todo;
  document.getElementById('item').style.visibility='visible';
  document.getElementById('additem').style.visibility='visible';
}

const addTask = function () {
  let objective = document.getElementById("item").value;
  let todoId =+document.getElementById("todoId").textContent;
  if(objective=="") return;
  let reqBody = `todoId=${todoId}&&objective=${objective}`;
  sendAjaxRequest("POST",'/addTodoItem',displayTodo,reqBody)
}

const changeStatus= function(id){
  let todoId = +document.getElementById("todoId").textContent;
  let links = {
    true : '/markItem',
    false : '/unmarkItem'
  }
  let reqBody = `todoId=${todoId}&&itemId=${id}`;
  let status = document.getElementById(id).checked;
  let url =  links[status];
  sendAjaxRequest("POST",url,noAction,reqBody);
}

const editTitle = function(id){
  let title = document.getElementById(id).innerText;
  let newTitle = `<input onkeydown='modifyTitle(event)' id='newTitle' value='${title}'/>`
  document.getElementById(id).innerHTML = newTitle;
}

const editDescription = function(id){
  let description = document.getElementById(id).innerText;
  let newDescription = `<input onkeydown='modifyDescription(event)' id='newDescription' onfocusout='reload()' value='${description}'/>`
  document.getElementById(id).innerHTML = newDescription;
}

const modifyTitle = function(event){
  let url;
  let queryString;
  let todoId = +document.getElementById('todoId').textContent;
  let newTitle = document.getElementById('newTitle').value;
  if(event.key=='Enter'&& newTitle !=""){
    modifyTodoTitle(todoId,newTitle);
    return
  }
  if(event.key=='Enter'&& newTitle ==""){
    deleteTodo(todoId)
    return;
  }
  if(event.key=='Escape'){
    getTodo(todoId);
    return;
  }
}

const modifyTodoTitle = function(todoId,newTitle) {
  url='/modifyTodoTitle'
  queryString =`todoTitle=${newTitle}&todoId=${todoId}`
  sendAjaxRequest("POST",url,displayTodo,queryString);
}

const modifyDescription = function(event){
  let url;
  let queryString;
  let todoId = +document.getElementById('todoId').textContent;
  let newDescription = document.getElementById('newDescription').value;
  if(event.key=='Enter'&& newDescription !=""){
    modifyTodoDescription(todoId,newDescription);
  }
  if(event.key=='Enter'&& newDescription ==""){
    modifyTodoDescription(todoId,'no description');
  }
  if(event.key=='Escape'){
    getTodo(todoId);
    return;
  }
}

const modifyTodoDescription = function (todoId,newDescription) {
  url='/modifyTodoDescription'
  queryString =`todoDescription=${newDescription}&todoId=${todoId}`
  sendAjaxRequest("POST",url,displayTodo,queryString);
}

const deleteTodo = function(todoId) {
  url='/deleteTodo'
  queryString =`todoId=${todoId}`;
  sendAjaxRequest("POST",url,displayTodoTitleList,queryString);
  return;
}

const editItem = function (id) {
  let oldObjective = document.getElementById(id).previousSibling.textContent;
  let newObjective = `<input onfocusout='reload()' id="newObjective" type="text" value=${oldObjective} onkeydown="modifyObjective(event,${id})"></input>`;
  document.getElementById(id).previousSibling.innerHTML=newObjective;
  document.getElementById(id).style.visibility= 'hidden';
}
const reload = function () {
  let todoId = +document.getElementById('todoId').textContent;
  getTodo(todoId);
}
const modifyObjective = function(event,itemId){
  let newObjective = document.getElementById('newObjective').value;
  let todoId = +document.getElementById('todoId').textContent;
  if(event.key=='Enter'&& newObjective !=""){
    modifyTodoItem(todoId,itemId,newObjective);
  }
  if(event.key=='Enter'&& newObjective ==""){
    deleteTodoItem(todoId,itemId)
  }
  if(event.key=='Escape'){
    getTodo(todoId);
    return;
  }
}

const modifyTodoItem =function (todoId,itemId,objective) {
  let queryString = `todoId=${todoId}&itemId=${itemId}&objective=${objective}`;
  sendAjaxRequest("POST",'/modifyTodoItem',displayTodo,queryString);
  return;
}

const deleteTodoItem =function (todoId,itemId) {
  let queryString = `todoId=${todoId}&itemId=${itemId}`;
  sendAjaxRequest("POST",'/deleteTodoItem',displayTodo,queryString);
  return;
}

window.onload = loadTodoTitles;
