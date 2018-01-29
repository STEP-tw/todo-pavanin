
const generateHtmlFor = {
  todoTitlesList : function (todos,eventFunction) {
    let todoIds=Object.keys(todos);
    if(todoIds.length==0) return "<h4>no todos</h4>";
    let htmlCode=todoIds.reduce((accumulator,todoId)=>{
      let todo=todos[todoId];
      return accumulator+=`<li id=${todoId} title='${todo.getDescription()}' onclick='${eventFunction}(this.id)'>${todo.getTitle()}</li>`;
    },"");
    return `<ul>${htmlCode}</ul>`;
  },

  todo : function (todo,onclickFunction) {
    let idLabel = `<label id='todoId' class="invisible">${todo.getTodoId()}</label>`;
    let titleHeader = `<h2 ondblclick='editTitle(this.id)' id='title'>${todo.getTitle()}</h2>`;
    let descriptionHeader =`<h4 ondblclick='editDescription(this.id)' id='description'>${todo.getDescription()}</h4>`;
    let itemIds = Object.keys(todo.getItems());
    let itemsList = itemIds.reduce((accumulator,itemId)=>{
      let status = todo.getItemStatus(itemId) && 'checked' || 'unchecked';
      accumulator += `<label for='${itemId}'>${todo.getItemObjective(itemId)}</label><input onclick='${onclickFunction}(this.id)' ondblclick='editItem(this.id)' type='checkbox' id=${itemId} ${status}><br>`
      return accumulator;
    },``);

    return `${idLabel}${titleHeader}<br>${descriptionHeader}<br>${itemsList}<br>`
  }
}

module.exports=generateHtmlFor;
