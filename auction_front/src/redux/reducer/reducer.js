import { combineReducers } from "redux";
import { loginedInfoReducer } from "./loginedInfoReducer";
import overBidReducer from './overBidReducer';

export const reducer = combineReducers({
    loginedInfos: loginedInfoReducer,
    notificationOverBid: overBidReducer
});