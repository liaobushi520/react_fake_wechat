function test(params) {
  console.log("xxxxx=====","ccc"+params)
  
}

function test1(){
    console.log("yyyyy=====","ccc")
}

function test3(){
    console.log("yyyyy=====","nnnn")
}


 
(test1,test,test3)("xxx")
 

 