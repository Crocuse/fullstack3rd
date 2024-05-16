import { combineReducers } from "redux";
import { loginedInfoReducer } from "./loginedInfoReducer";
import alarmInfoInDBReducer from './alarmInfoInDBReducer ';

export const reducer = combineReducers({
    loginedInfos: loginedInfoReducer,
    alarmInfo: alarmInfoInDBReducer,
});