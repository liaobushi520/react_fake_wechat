import { type } from "os";

export type  Param=string | number;

export declare function log(param:Param):void



export  interface A{
    //function
    (p:string):string
}

export declare interface Human{
    name:string
    age:number
}

export  declare interface Fly{
    fly():string
}

export declare type SuperMan =  &Human
     
  
declare  function test(params:SuperMan):void





 





