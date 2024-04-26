import { combineReducers } from "redux";
import { loginedInfoReducer } from "./loginedInfoReducer";

export const reducer = combineReducers({
    loginedInfos: loginedInfoReducer
});