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
  console.log(document.getElementById("todoId").value);
  let todoId =+document.getElementById("todoId").innerText;

  let xmlReq = new XMLHttpRequest();
  xmlReq.addEventListener('load',displayTodo);
  xmlReq.open('POST','/addTodoItem');
  xmlReq.send(`todoId=${todoId}&&objective=${objective}`);
}

window.onload = loadTodoTitles;
