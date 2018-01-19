const Todo= require("./todo.js");
const Item= require("./item.js");

class User{
  constructor(name){
    this.name=name;
    this.todos={}
    this.todoId=0;
  }
  getName(){
    return this.name;
  }
  getTodos(){
    return this.todos;
  }
  getTodo(id){
    return this.todos[id];
  }
  addTodo(title,description){
    let todo=new Todo(this.todoId,title,description);
    this.todos[this.todoId]=todo;
    this.todoId++;
  }
  deleteTodo(id){
    delete this.todos[id];
  }
  modifyTodoTitle(newTitle,todoId){
    this.todos[todoId].modifyTitle(newTitle);
  }
  modifyTodoDescription(newDescription,todoId){
    this.todos[todoId].modifyDescription(newDescription);
  }
  addTodoItem(item,todoId){
    this.todos[todoId].addItem(item);
  }
  deleteTodoItem(todoId,itemId){
    this.todos[todoId].deleteItem(itemId);
  }
  modifyTodoItem(todoId,itemId,newItem){
    this.todos[todoId].modifyItem(itemId,newItem);
  }
  markTodoItem(todoId,itemId){
    this.todos[todoId].markItem(itemId);
  }
  unmarkTodoItem(todoId,itemId){
    this.todos[todoId].unmarkItem(itemId);
  }
}
module.exports= User;
