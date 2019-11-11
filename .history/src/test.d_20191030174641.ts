import { type } from "os";

export type  Param=string | number;

declare function log(param:Param):void



export  interface A{
    //function
    (p:string):string
}

interface Human{
    name:string
    age:number
}

interface Fly{
  fly():string
}

type SuperMan = &Human
                &Fly

export declare  function test(params:SuperMan) {
    console.log(params.name + " "+params.age +" "+params.fly())
}
 





