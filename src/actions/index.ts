import { Action } from "redux";

export const Filter_Contact="Filter_Contact"

export interface FilterContactAction extends Action {
    keyword: string
}
 
export const filterContact=keyword=>({
   type:"Filter_Contact",
   keyword:keyword
} as FilterContactAction)

 