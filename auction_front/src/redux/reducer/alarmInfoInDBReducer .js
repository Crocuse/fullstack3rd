// alarmInfoInDBReducer.js
const initialState = {
    alarmInfo: [],
    hasNewAlarm: false,
};

const alarmInfoInDBReducer = (state = initialState, action) => {
    console.log('[ALARMINFO REDUCER]');

    switch (action.type) {
        case 'SET_ALARM_INFO':
            return { ...state, alarmInfo: action.payload };
        case 'SET_HAS_NEW_ALARM':
            return { ...state, hasNewAlarm: action.payload };
        default:
            return state;
    }
};

export default alarmInfoInDBReducer;
