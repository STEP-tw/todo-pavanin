
const generateHtmlFor = {
  todoTitlesList : function (todos,eventFunction) {
    let todoIds=Object.keys(todos);
    let htmlCode=todoIds.reduce((accumulator,todoId)=>{
      let todo=todos[todoId];
      return accumulator+=`<li id=${todoId} title='${todo.getDescription()}' onclick='${eventFunction}(this.id)'>${todo.getTitle()}</li>`;
    },"");
    return `<ul>${htmlCode}</ul>`;
  },

  todo : function (todo,onclickFunction,ondblclickFunction) {
    let idLabel = `<label id='todoId' value=${todo.getTodoId()}></label>`;
    let titleHeader = `<h2 id='title'>${todo.getTitle()}</h2>`;
    let descriptionHeader =`<h4 id='description'>${todo.getDescription()}</h4>`;
    let itemIds = Object.keys(todo.getItems());
    let itemsList = itemIds.reduce((accumulator,itemId)=>{
      let status = todo.getItemStatus(itemId) && 'checked' || 'unchecked';
      accumulator += `<label for='${itemId}'>${todo.getItemObjective(itemId)}</label><input onclick='${onclickFunction}(this.id)' ondblclick='${ondblclickFunction}(this.id)' type='checkbox' id=${itemId} ${status}/></br>`
      return accumulator;
    },``);

    return `${idLabel}</br>${titleHeader}</br>${descriptionHeader}</br>${itemsList}</br>`
  }
}

module.exports=generateHtmlFor;
