import { type } from "os";

export type  Param=string | number;

declare function log(param:Param):void



export  interface A{
    //function
    (p:string):string
}

export declare interface Human{
    name:string
    age:number
}

export  declare interface Fly{
    fly:(()=>string)
}

export declare type SuperMan = 
                &Human
                &Fly

export declare  function test(params:SuperMan) {
    console.log(params.name + " "+params.age +" ")
}





 





