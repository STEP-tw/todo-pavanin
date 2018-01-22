class MockFs{
  constructor(){
    this.files={}
  }

  addFile(name,content){
    this.files[name]=content;
  }

  readFileSync(fileName,encoding="utf8"){
    return this.files[fileName];
  }

  existsSync(fileName){
    return Object.keys(this.files).includes(fileName);
  }

  appendFile(fileName,content,func){
    this.files[fileName]+=content;
    return func();
  }

}

module.exports=MockFs
