const alarmInfoInDBReducer   = (state = [] , action) => {
    console.log('[ALARMINFO REDUCER]');
    
    switch (action.type) {
        case 'SET_ALARM_INFO':
            return action.payload;
            
        default:
            return state;
            }
    }
    export default alarmInfoInDBReducer ;