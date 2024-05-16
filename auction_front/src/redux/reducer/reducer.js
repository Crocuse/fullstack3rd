import { combineReducers } from "redux";
import { loginedInfoReducer } from "./loginedInfoReducer";
import overBidReducer from './overBidReducer';
import alarmInfoInDBReducer from './alarmInfoInDBReducer ';

export const reducer = combineReducers({
    loginedInfos: loginedInfoReducer,
    notificationOverBid: overBidReducer,
    alarmInfo: alarmInfoInDBReducer,
});