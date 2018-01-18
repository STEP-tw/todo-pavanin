const Item= function(objective,id){
  this.objective=objective;
  this.id=id;
  this.status=false;
}

Item.prototype={
  isDone:function(){
    return this.status;
  },

  mark:function(){
    this.status=true;
  },

  unMark:function(){
    this.status=false;
  },

  modify:function(newObjective){
    this.objective=newObjective;
  },

  getObjective:function(){
    return this.objective;
  },

  getId:function(){
    return this.id;
  }

}

module.exports=Item;
