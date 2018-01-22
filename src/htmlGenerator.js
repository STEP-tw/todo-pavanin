
const generateHtmlFor = {
  todoTitlesList : function (todos,eventFunction) {
    let todoIds=Object.keys(todos);
    let htmlCode=todoIds.reduce((accumulator,todoId)=>{
      let todo=todos[todoId];
      return accumulator+=`<li id=${todoId} title='${todo.getDescription()}' onclick='${eventFunction}(this.id)'>${todo.getTitle()}</li>`;
    },"");
    return `<ul>${htmlCode}</ul>`;
  }
}

module.exports=generateHtmlFor;
